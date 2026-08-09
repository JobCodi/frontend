# 매칭 근거 고도화 Implementation Plan

> **For Hermes:** Test each behavior before implementation and record RED → GREEN.

**Goal:** 기존 서버 매칭 결과를 상세 화면에서 범주형 판단 정보로 보여준다.

**Architecture:** `match-evidence.ts` 순수 유틸리티가 server-owned `scoreBreakdown`과 reasons를 UI-ready 그룹으로 매핑한다. `match-evidence.test.ts`가 Vitest로 매핑을 검증하고, client leaf component가 결과만 렌더한다.

---

### Task 1: 테스트 환경과 reason 분류 계약

**Files**
- Modify: `package.json`
- Create: `src/features/job-feed/lib/match-evidence.test.ts`

1. Vitest script를 추가한다.
2. mixed `match`/`caution`/`gap` fixture가 expected group 순서와 텍스트를 반환한다는 failing test를 작성한다.
3. `corepack pnpm test`가 feature missing으로 실패함을 확인한다.

### Task 2: 최소 분류 구현

**Files**
- Create: `src/features/job-feed/lib/match-evidence.ts`

1. reasons와 서버 `scoreBreakdown`을 받는 `buildMatchEvidence`를 구현한다.
2. 값을 재계산하지 않고 label과 전달된 값만 매핑한다.
3. targeted test green을 확인한다.

### Task 3: 상세 UI 적용

**Files**
- Create: `src/features/job-feed/components/match-evidence-panel.tsx`
- Modify: `src/features/job-feed/components/job-detail.tsx`

1. 기존 detail의 server-owned JobView를 새 패널에 전달한다.
2. 빈 reason group을 렌더하지 않는다.
3. lint/typecheck/build와 실제 browser 상세 QA를 수행한다.

### Task 4: 문서·PR·Notion

1. 계획과 구현 범위를 PR에 기록한다.
2. CI 통과 후 squash merge한다.
3. Notion 카드를 Review → Done으로 갱신한다.
