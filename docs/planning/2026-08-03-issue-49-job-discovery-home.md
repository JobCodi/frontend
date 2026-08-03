# 맞춤 공고 탐색 홈 화면 구현 계획

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** JobCodi의 홈을 AI 대화 기반 맞춤 공고 탐색 허브로 개편한다.

**Architecture:** 외부 데이터 의존 없이 `src/app/page.tsx`의 Server Component에서 정적 프리뷰 데이터와 재사용 가능한 Lucide 아이콘을 렌더링한다. 기존 토큰과 `Button` 프리미티브를 사용하며 모든 탐색 진입은 현재 제품 플로우인 `/start`로 연결한다.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, Tailwind CSS 4, lucide-react.

---

### Task 1: 홈 정보 구조와 프리뷰 데이터 정의

**Objective:** 히어로, 탐색 칩, 예시 공고, 단계, 출처를 화면 데이터로 분리한다.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1:** 각 카드에 필요한 정적 타입과 데이터 배열을 정의한다. 예시임을 화면 카피로 명시한다.

**Step 2:** `pnpm typecheck`를 실행한다.

**Step 3:** 통과 상태를 확인한다.

### Task 2: 반응형 홈 화면 구현

**Objective:** 2열 히어로, AI 조건 프리뷰, 직무 칩, 공고 미리보기, 신뢰 영역을 구현한다.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1:** 모든 CTA/칩을 `/start` 링크로 구현한다.

**Step 2:** `Button`, CSS 토큰, Lucide 아이콘만 사용해 단일 시각 언어를 유지한다.

**Step 3:** `pnpm lint && pnpm typecheck && pnpm build`를 실행한다.

### Task 3: 브라우저 QA 및 문서 검증

**Objective:** 실제 브라우저에서 홈의 데스크톱/모바일 레이아웃과 주요 이동을 확인한다.

**Files:**
- Verify: `src/app/page.tsx`
- Verify: `docs/superpowers/specs/2026-08-03-job-discovery-home-design.md`

**Step 1:** 개발 서버에서 `/`의 CTA, 직무 칩, 소개 링크를 확인한다.

**Step 2:** 모바일 viewport에서 1열 전환과 가로 overflow 부재를 확인한다.

**Step 3:** QA 결과를 PR에 기록한다.
