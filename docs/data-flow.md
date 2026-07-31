# 데이터 흐름과 상태 설계

## 1. 상태를 어디에 두는가

| 종류 | 도구 | 예시 |
| --- | --- | --- |
| 서버 상태 | TanStack Query | 세션, 턴, 조건, 피드, taxonomy |
| 클라이언트 전용 상태 | Zustand | 목표 입력 폼 진행 상태, 조건 인라인 편집 중인 필드 |
| URL 상태 | `searchParams` | 피드 정렬·필터 |
| 브라우저 영속 | `localStorage` | 세션 ID |

**서버 응답을 Zustand에 복제하지 않는다** (Rules.md). 세션 상태는 언제나 TanStack Query 캐시가 정본이다.

## 2. 데이터 소유권

```text
                    ┌─────────────────────────────┐
   Server Component │ GET /taxonomy               │  정적, 1시간 캐시
   (fetch, no cache │ GET /sessions/:id           │  초기 SSR
    key)            └─────────────────────────────┘
                                 │ initialData
                                 ↓
                    ┌─────────────────────────────┐
   TanStack Query   │ ['session', id]             │
   (Client)         │ ['criteria', id]            │
                    │ ['feed', id, sort, minScore]│  무한 쿼리
                    └─────────────────────────────┘
                                 │
                                 ↓
                    ┌─────────────────────────────┐
   Zustand          │ startForm  (제출 전 폼 값)   │
   (Client only)    │ criteriaEdit (편집 중 필드)  │
                    └─────────────────────────────┘
```

## 3. 쿼리 키

`src/lib/query/keys.ts`에 모아둔다. 문자열 리터럴을 컴포넌트에 흩뿌리지 않는다.

```ts
export const queryKeys = {
  taxonomy: () => ["taxonomy"] as const,
  session: (id: string) => ["session", id] as const,
  criteria: (id: string) => ["criteria", id] as const,
  feed: (id: string, params: FeedParams) => ["feed", id, params] as const,
  job: (id: string) => ["job", id] as const,
} as const;
```

## 4. 화면별 흐름

### 4.1 `/start` → 세션 생성

```text
Server Component
  └─ fetch GET /taxonomy  (next: { revalidate: 3600 })
        │
        ↓ props
Client 폼 (Zustand: startForm)
  └─ useMutation POST /sessions
        ├─ onSuccess:
        │    localStorage.setItem("jobcodi.session", sessionId)
        │    queryClient.setQueryData(['session', id], response)   // 첫 질문 프리필
        │    router.push(`/discovery/${sessionId}`)
        └─ onError: 인라인 에러, 폼 값 유지
```

세션 생성 응답에 이미 첫 질문이 들어 있으므로, `/discovery`에서 다시 조회하지 않도록 `setQueryData`로 캐시를 미리 채운다. 이게 없으면 화면 전환 직후 로딩이 한 번 더 뜬다.

### 4.2 `/discovery` → 턴 진행

```text
useQuery(['session', id])          ← 새로고침 시 SSR initialData
useMutation POST /turns
  onSuccess(response):
    if (response.status === "interviewing")
      queryClient.setQueryData(['session', id], merge(prev, response))
    else
      queryClient.setQueryData(['criteria', id], response.criteria)
      router.push(`/discovery/${id}/criteria`)
  onError(409):
    queryClient.invalidateQueries(['session', id])
    → 갱신된 status로 올바른 화면 재라우팅
```

**낙관적 업데이트를 쓴다.** 사용자 답변은 즉시 히스토리에 붙이고, 질문 자리에는 타이핑 인디케이터를 띄운다. 실패하면 답변을 되돌린다.

### 4.3 `/criteria` → 수정·확정

```text
useQuery(['criteria', id])
useMutation PATCH /criteria
  onSuccess: setQueryData(['criteria', id], next)   // estimatedCount 포함
useMutation POST /criteria/confirm
  onSuccess: invalidateQueries(['session', id])
             router.push(`/feed/${id}`)
```

편집 중인 필드는 Zustand `criteriaEdit`에 둔다. 저장 전 값이고 서버 상태가 아니다.

### 4.4 `/feed` → 폴링 → 무한 스크롤

```text
useInfiniteQuery(['feed', id, { sort, minScore }])
  queryFn: GET /sessions/:id/feed?cursor&sort&minScore
  getNextPageParam: (last) => last.hasMore ? last.nextCursor : undefined
  refetchInterval: (query) =>
    query.state.data?.pages[0]?.status === "collecting" ? 2000 : false
```

폴링은 `refetchInterval`의 함수 형태로 구현한다. `status`가 `collecting`이 아니게 되면 자동으로 멈춘다. 별도 `useEffect` 타이머를 만들지 않는다.

60초 상한은 별도로 센다:

```ts
// 폴링 시작 시각을 기록하고, 60초를 넘기면 refetchInterval을 false로 강제
```

정렬·필터 변경은 `router.replace`로 `searchParams`를 바꾼다. 쿼리 키가 바뀌면서 새 무한 쿼리가 시작된다. 뒤로 가기로 이전 정렬 상태가 복원된다.

## 5. 세션 복원

`src/lib/session/restore.ts`.

```text
1. localStorage에서 세션 ID 읽기
2. 없으면 → 랜딩 기본 상태
3. GET /sessions/:id
     404 → localStorage 정리 → /session-expired
     200 → status로 복귀 지점 결정

   interviewing        → /discovery/:id
   criteria_ready      → /discovery/:id/criteria
   collecting | ready  → /feed/:id
   collection_failed   → /feed/:id
   abandoned           → /session-expired
```

이 매핑은 `src/lib/session/route-for-status.ts` 한 곳에만 둔다. 여러 화면에서 각자 분기하면 상태 전이가 어긋난다.

## 6. API 클라이언트

`src/lib/api/client.ts`.

- `NEXT_PUBLIC_API_BASE_URL` 기준.
- 응답을 zod로 검증한 뒤 반환한다. 서버 계약이 깨지면 렌더 중이 아니라 경계에서 터져야 한다.
- 오류 응답(`{ error: { code, message } }`)을 `ApiError` 클래스로 정규화한다. 컴포넌트는 `code`로 분기한다.
- **재시도 정책:** `GET`은 2회, `POST`는 0회. 세션 생성이나 턴 제출을 자동 재시도하면 중복 세션과 중복 턴이 생긴다.

```ts
export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) { super(message); }
}
```

### 응답 스키마 검증

`src/lib/schemas/`에 백엔드 응답 zod 스키마를 둔다. 백엔드 `@jobcodi/contracts`와 형태가 같아야 하지만, **패키지를 공유하지 않는다** — 레포가 분리되어 있고 프론트가 필요한 것은 응답 형태뿐이다. 계약이 어긋나면 zod 검증이 즉시 잡는다.

## 7. 하지 않는 것

- **`useEffect`에서 데이터를 가져오지 않는다.** Server Component나 TanStack Query를 쓴다.
- **점수를 재계산하지 않는다.** `score`와 `reasons`는 서버가 준 그대로 렌더한다.
- **피드를 클라이언트에서 필터링하지 않는다.** 페이지네이션과 어긋난다.
- **AI 프로바이더 키를 브라우저에 두지 않는다.** 대화는 전부 백엔드를 경유한다.
- **세션 ID를 쿼리스트링에 넣지 않는다.** 경로 파라미터로만 쓴다 (리퍼러 유출 축소).

## 8. 로딩·에러 경계

```text
app/
├── (flow)/
│   ├── discovery/[sessionId]/
│   │   ├── loading.tsx      대화 셸 스켈레톤
│   │   ├── error.tsx        재시도 + 랜딩 복귀
│   │   └── page.tsx
│   └── feed/[sessionId]/
│       ├── loading.tsx      카드 스켈레톤 3장
│       └── error.tsx
```

`error.tsx`는 `ApiError.code`로 분기한다:

| code | 처리 |
| --- | --- |
| `SESSION_NOT_FOUND` | `/session-expired`로 리다이렉트 |
| `SESSION_STATE_INVALID` | 세션 재조회 후 올바른 화면으로 |
| `AI_PROVIDER_UNAVAILABLE` | "AI 응답이 불안정해요" + 재시도 |
| 그 외 | 일반 에러 + 재시도 |

## 관련 문서

- [사이트맵](sitemap.md)
- [화면 명세](screens.md)
- [제품 개요](product.md)
