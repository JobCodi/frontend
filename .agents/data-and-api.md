# 데이터·API 작업 프로필

## 상태 소유권

- 서버 상태는 TanStack Query, 제출 전·편집 중 로컬 상태만 Zustand, 공유 가능한 필터·정렬 상태는 URL에 둔다.
- 쿼리 키는 `src/lib/query/keys.ts`에서 관리하고, mutation 뒤에는 올바른 캐시 갱신 또는 무효화를 적용한다.
- API 응답은 `src/lib/schemas/`의 zod 스키마를 통과한 뒤 사용하고, 오류는 `ApiError` 경계에서 정규화한다.

## 요청과 피드

- POST mutation은 자동 재시도하지 않는다. GET만 프로젝트 정책에 맞춰 재시도한다.
- 피드 폴링은 `refetchInterval` 함수로 `collecting` 상태에서만 실행하고, `useEffect` 타이머를 만들지 않는다.
- `score`, `rank`, `reasons`, 정렬·필터, 커서는 서버 정본을 사용한다. 클라이언트에서 다시 계산·정렬·필터링하지 않는다.

## 계약 변경

- 백엔드 계약 변경 시 프런트 스키마, API 클라이언트, 오류·로딩 처리, 관련 화면을 함께 갱신한다.
- AI 프로바이더 키와 공고 본문은 브라우저로 보내지 않는다.
