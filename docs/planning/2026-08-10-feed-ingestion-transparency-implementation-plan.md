# Feed 수집 투명성 구현 계획

> Issue #72의 사용자 화면 범위만 구현한다.

## TDD 순서

1. `checkedAt` 유무 호환, failed `generatedAt`, 출처 상태·건수·사유, 접힘 버튼 접근성 계약 테스트를 먼저 추가한다.
2. 테스트 실패를 확인한 뒤 Feed schema를 최소 확장한다.
3. `SourceSummaryList`에 선택적 확인 시각과 사유를 표시한다.
4. ready/failed 공통 expandable card를 만들고 summary/criteria와 Feed 콘텐츠 사이에 배치한다.
5. 기존 실패·0건 화면의 중복 출처 목록을 제거한다.

## 검증

- 대상 Vitest
- `pnpm install --frozen-lockfile`
- `pnpm lint && pnpm typecheck && pnpm build`
- 모바일 폭, 키보드 토글, ready/failed/collecting/빈 summary 수동 QA
