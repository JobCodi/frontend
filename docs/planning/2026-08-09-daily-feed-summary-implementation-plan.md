# 일일 Feed 변화 요약 Implementation Plan

> **For Hermes:** Test each production behavior first, observe RED, then write the minimum GREEN implementation.

**Goal:** 일일 scheduler refresh의 변화량을 사용자별로 저장하고 Feed에서 보여준다.

**Architecture:** Feed collection은 스케줄 실행 여부를 명시적으로 전달받고 이전 item set/새 scoring set을 비교한다. `DailyFeedSummary`가 user/session/day별 결과를 upsert한다. Profile API는 authenticated active session의 최신 summary만 반환한다. Frontend는 실패가 Feed를 막지 않는 별도 query로 summary card를 렌더한다.

---

### Task 1: 변화 계산 pure helper
- Test: `backend/src/modules/feed/tests/daily-feed-change.util.spec.ts`
- Create: `backend/src/modules/feed/daily-feed-change.util.ts`
1. 신규/사라짐/D-3 count 테스트 작성 → RED 확인.
2. Set 기반 minimal helper 구현 → GREEN 확인.

### Task 2: summary persistence
- Test: `backend/src/modules/feed/tests/daily-feed-summary.service.spec.ts`
- Create: entity/service/module + migration
1. user/session/day upsert 및 첫 baseline 테스트 → RED.
2. entity, repository service, MikroORM 등록 구현 → GREEN.

### Task 3: scheduler collection integration
- Test: `backend/src/modules/feed/tests/feed.service.spec.ts`
- Modify: `feed.service.ts`, scheduler service
1. scheduled collection만 summary write를 요청하는 테스트 → RED.
2. 기존 items 삭제 전 ID set snapshot, collection success 시 summary persist → GREEN.

### Task 4: active-profile API
- Test: `backend/src/modules/profiles/tests/profile.service.spec.ts`
- Modify: profile controller/service/module, REST docs
1. owner-scoped latest summary response 테스트 → RED.
2. endpoint 구현·A/E/X 문서화 → GREEN.

### Task 5: Frontend card
- Create: `src/lib/schemas/daily-feed-summary.ts`, query hook, `daily-feed-summary-card.tsx`
- Modify: `feed-screen.tsx`, query keys
1. schema/query contract을 먼저 작성한다.
2. ready Feed에서 only summary 존재 시 compact card를 렌더한다.
3. lint/typecheck/build + authenticated browser E2E를 실행한다.

### Task 6: delivery
- migration apply/pending 확인, full test/build, real browser QA.
- PR/CI/merge/Notion Done.
