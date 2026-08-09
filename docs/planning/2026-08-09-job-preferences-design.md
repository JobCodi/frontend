# 공고 관심·제외 상태와 맞춤 피드 필터 설계

## 목표
로그인 사용자가 맞춤 공고를 **관심**, **제외**, **미분류** 세 상태로 관리하고, 제외된 공고는 기본 피드에서 제거하며 관심 공고만 서버 기준으로 다시 조회할 수 있게 한다.

## 범위
- 상태는 `app_user`와 `job_posting`의 조합으로 영속화한다.
- 상태 변경은 인증된 소유자만 가능하고 같은 상태를 반복 요청해도 결과가 동일한 upsert 방식이다.
- 기본 Feed는 `excluded` 상태를 반환하지 않는다.
- 관심 필터는 클라이언트 배열 필터링이 아니라 Feed API query로 처리한다.
- 카드와 상세 화면에서 상태를 바꾸고, 상태 변경 이후 TanStack Query의 해당 Feed를 invalidate한다.

## 비범위
- 공고 본문 저장·표시
- 팀 공유 목록, 메모, 지원 단계, 알림
- 익명 사용자의 영속 상태

## API 및 데이터 계약

### `user_job_preference`
| 필드 | 설명 |
| --- | --- |
| `id` | UUID primary key |
| `user_id` | `app_user` FK, cascade delete |
| `job_posting_id` | `job_posting` FK, cascade delete |
| `status` | `saved` 또는 `excluded` |
| `created_at`, `updated_at` | 상태 생성·변경 시각 |

`(user_id, job_posting_id)`는 unique다. 미분류 상태는 row를 삭제해서 표현한다.

### 상태 API
- `PUT /jobs/:jobId/preference` body `{ status: "saved" | "excluded" | "none" }`
- 응답 `{ jobId, status }`
- `none`은 preference row를 제거한다.
- 모든 요청은 JWT guard를 통과해야 하며, 존재하지 않는 공고는 404다.

### Feed API
기존 `GET /sessions/:id/feed`에 `preference=all|saved`를 추가한다.
- `all`(기본): 사용자의 `excluded` 공고를 제외한다.
- `saved`: 사용자의 `saved` 공고만 반환한다.
- 익명/세션 소유자가 아닌 요청은 기존 피드 동작을 유지한다.
- 응답 item에 해당 사용자 preference를 포함한다.

## UI 설계
- `JobCard`: 점수 옆에 상태 버튼을 제공한다. 미분류는 관심 저장, 저장됨은 저장 해제, 제외는 기본 Feed에서 노출되지 않는다.
- `JobDetail`: 제목 헤더 우측에 저장/제외/해제 액션을 제공한다. 아이콘만으로 구분하지 않고 `aria-label`과 텍스트 상태를 제공한다.
- `SortFilterBar`: `전체 공고` / `관심 공고` 토글을 추가한다. URL 상태와 TanStack Query key에 preference filter를 포함한다.
- 변경 mutation은 자동 재시도하지 않는다. 성공 시 같은 session의 Feed·detail query만 invalidate한다.

## 오류 및 접근성
- 상태 mutation 실패 시 인라인 오류를 표시하고 이전 UI 상태를 추측하지 않는다.
- 상태 변경 버튼은 pending 중 disabled + 진행 레이블을 사용한다.
- `saved` 필터가 비었을 때는 관심 공고가 없다는 명확한 empty state와 전체 공고 복귀 CTA를 제공한다.
- 모든 선택 제어는 `<button>`이며 키보드 포커스와 visible focus ring을 유지한다.

## 검증
1. Backend unit/integration: 인증·upsert·none 삭제·다른 사용자 격리·기본 Feed excluded 제거·saved filter를 테스트한다.
2. Frontend: schema/query key/path가 preference parameter를 보존하는지 테스트한다.
3. 전체: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`를 통과한다.
4. 브라우저 QA: 로그인 → Feed → 관심 저장 → 관심 필터 → 해제 → 제외 → 기본 Feed에서 사라짐을 실제 API·DB 환경으로 검증한다.
