# JobCodi Frontend Rules

이 문서는 JobCodi Next.js 프론트엔드의 구조와 TypeScript 규약을 정의한다.

## 1. 프로젝트 구조

App Router + 라우트 그룹 + 기능 단위 UI 모듈.

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  /
│   │   ├── globals.css
│   │   ├── (marketing)/about/page.tsx
│   │   ├── (flow)/                   사용자 플로우 라우트
│   │   └── session-expired/page.tsx
│   ├── components/
│   │   ├── ui/                       shadcn/ui 프리미티브
│   │   ├── layout/
│   │   └── feedback/
│   ├── features/
│   │   ├── goal-intake/              ① 목표 입력
│   │   ├── discovery/                ② AI 대화
│   │   ├── criteria/                 ③ 조건 확인·수정
│   │   └── job-feed/                 ④ 공고 피드
│   └── lib/                          API·query·schema·session·utils
├── public/brand/
├── next.config.ts
└── tsconfig.json
```

### 기능 폴더 형태

```text
features/<feature>/
├── components/
├── hooks/
├── queries/                          TanStack Query 훅
├── schemas/
├── stores/                           기능 전용 Zustand
├── types.ts
└── index.ts
```

### 라우팅 규칙

- 기본은 Server Component. `'use client'`는 상호작용하는 잎 컴포넌트까지 내린다.
- 라우트 파일은 얇게 유지한다. 복잡한 UI는 `_components` 또는 `features/*`로 옮긴다.
- Next.js 15+에서 `params`와 `searchParams`는 Promise다. 항상 await한다.
- `useSearchParams`, `useParams`, `useRouter`를 쓰는 클라이언트 컴포넌트는 정적 렌더링에 영향을 줄 수 있으므로 `Suspense`로 감싼다.

## 2. 제품 계약

이 세 가지는 백엔드와의 계약이자 제품 정체성이다. 어기면 안 된다.

### 2.1 점수 옆에는 항상 근거가 있다

백엔드는 모든 공고에 `reasons: MatchReason[]`를 필수로 내려준다.

- 점수만 표시하는 카드를 만들지 않는다.
- `reasons`가 빈 배열이면 그 카드를 렌더하지 않고 에러로 보고한다 (API 계약 위반).
- `kind`는 `match` / `caution` / `gap` 세 가지이고, 각각 아이콘 + 색 + 텍스트로 표현한다. **색만으로 구분하지 않는다.**

### 2.2 점수를 클라이언트에서 재계산하지 않는다

`score`, `rank`, `scoreBreakdown`은 서버가 계산한 값이다. 정렬도 서버가 한다 (`?sort=`). 클라이언트에서 다시 정렬하거나 필터링하면 페이지네이션과 어긋난다.

### 2.3 공고 본문을 표시하지 않는다

백엔드는 공고 본문을 저장하지도 반환하지도 않는다. 상세 화면은 메타데이터 + 매칭 근거 + 원문 링크만 보여준다. 본문을 어딘가에서 가져와 채우려 하지 않는다.

## 3. 상태 관리

| 종류 | 도구 |
| --- | --- |
| 서버 상태 | TanStack Query |
| 클라이언트 전용 상태 | Zustand |
| URL 상태 | `searchParams` |
| 브라우저 영속 | `localStorage` (세션 ID만) |

- **서버 응답을 Zustand에 복제하지 않는다.** TanStack Query 캐시가 정본이다.
- 쿼리 키는 `lib/query/keys.ts`에 모은다. 문자열 리터럴을 컴포넌트에 흩뿌리지 않는다.
- Zustand 스토어는 작게, 기능 범위로 유지한다. 진짜 전역인 것만 `store/`에 둔다.
- **`useEffect`에서 데이터를 가져오지 않는다.** Server Component나 TanStack Query를 쓴다.

### 폴링

`refetchInterval`의 함수 형태로 구현한다. 별도 `useEffect` 타이머를 만들지 않는다.

```ts
refetchInterval: (query) =>
  query.state.data?.pages[0]?.status === "collecting" ? 2000 : false
```

### 재시도

- `GET` 2회, `POST` 0회.
- 세션 생성이나 턴 제출을 자동 재시도하면 중복 세션과 중복 턴이 생긴다.

## 4. API 경계

- 모든 응답을 zod로 검증한 뒤 반환한다. 계약이 깨지면 렌더 중이 아니라 경계에서 터져야 한다.
- 오류 응답을 `ApiError`(code, status, message)로 정규화한다. 컴포넌트는 `code`로 분기한다.
- API 클라이언트는 `lib/api` 또는 `features/*/services`에 둔다.
- **브라우저 코드가 AI 프로바이더 키나 백엔드 시크릿에 접근하지 않는다.**
- 세션 ID는 경로 파라미터로만 쓴다. 쿼리스트링에 넣지 않는다.

## 5. TypeScript 규약

### 엄격성

- `strict`를 끄지 않는다.
- `any`를 쓰지 않는다. `unknown`, zod 스키마, 명시적 인터페이스를 쓴다.
- `@ts-ignore`나 광범위한 타입 단언을 쓰지 않는다.
- non-null 단언(`!`)을 피한다. 명시적 가드를 쓴다.
- 컴포넌트 props와 공유 객체 형태에는 `interface`, 유니온·유틸리티·판별 UI 상태에는 `type`을 쓴다.

### React 규약

- 컴포넌트 파일은 PascalCase, 라우트·헬퍼 파일은 kebab-case.
- 공개 props는 `<ComponentName>Props`.
- HTML 요소를 감쌀 때는 네이티브 props를 확장한다.

```ts
interface ChoiceChipProps extends React.ComponentProps<'button'> {
  selected?: boolean;
}
```

- 클라이언트 상태는 멀리 떨어진 컴포넌트끼리 공유할 때만 끌어올린다.

## 6. 스타일링

- 디자인 토큰(`globals.css` CSS 변수)을 쓴다. 색상 리터럴을 반복해 쓰지 않는다.
- shadcn/ui가 이미 커버하는 프리미티브를 새로 만들지 않는다.
- 모바일 우선. `sm:` 접두 없는 스타일이 모바일이다.
- `prefers-reduced-motion: reduce`에서 애니메이션을 즉시 전환으로 바꾼다.

## 7. 접근성

- 대화 질문 영역은 `aria-live="polite"`. 새 질문이 스크린리더로 읽혀야 한다.
- 수집 진행 상태는 `role="status"`.
- 선택지 칩은 실제 `<button>`이다. `div` + `onClick`이 아니다.
- 매칭 근거 아이콘은 장식이다. `aria-hidden="true"`를 붙이고 의미는 텍스트가 전달한다.
- 포커스 링을 제거하지 않는다.
- 색만으로 정보를 전달하지 않는다.
- 모달에 포커스 트랩과 `Esc` 닫기를 붙인다.

## 8. 테스트

- 복잡한 UI 로직에는 단위/컴포넌트 테스트를 붙인다.
- 특히 다음은 테스트 필수다:
  - `status` → 복귀 라우트 매핑
  - `ApiError.code` → 에러 화면 분기
  - `reasons` 렌더링 (kind별 아이콘·텍스트)
  - 폴링 종료 조건
- 핵심 사용자 플로우는 Playwright 도입 후 e2e를 붙인다.
- PR에는 검증 증거를 포함한다: `pnpm lint`, `pnpm typecheck`, `pnpm build`, 테스트, 스크린샷.

## 9. Issue 기반 워크플로

- GitHub Issue 없이 구현을 시작하지 않는다.
- 브랜치명에 이슈 번호를 넣는다: `feat/<issue-number>-short-name`.
- PR은 `Closes #<number>` 또는 `Refs #<number>`로 이슈를 링크한다.
- PR 하나는 이슈 하나, 사용자 눈에 보이는 플로우 또는 컴포넌트 영역 하나로 유지한다.
