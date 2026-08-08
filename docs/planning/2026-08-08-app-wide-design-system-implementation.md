# JobCodi 전 화면 디자인 시스템 구현 계획

> **For Hermes:** 전 화면 UI를 변경하되 API·세션·피드 데이터 계약은 수정하지 않는다.

**Goal:** semantic design token과 공통 레이아웃 프리미티브를 도입해 JobCodi 전체 화면의 글자 위계, 콘텐츠 폭, 페이지 여백, 카드 surface 규칙을 통일한다.

**Architecture:** `globals.css`가 semantic token과 재사용 CSS utility를 제공하고, `src/components/layout`의 가벼운 Server Component 프리미티브가 페이지 폭·헤더 위계를 책임진다. 각 화면은 기존 상태·API 컴포넌트를 보존한 채 최상위 wrapper와 제목 class만 새 primitive/token으로 교체한다.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, Tailwind CSS v4, CSS custom properties.

---

### Task 1: semantic token과 공통 utility 추가

**Files:**
- Modify: `src/app/globals.css`

**Steps:**
1. 컨테이너, page spacing, card padding, type scale 토큰을 `:root`에 선언한다.
2. `@utility`로 `ui-page`, `ui-page-*`, `ui-eyebrow`, `ui-page-title`, `ui-section-title`, `ui-card-title`, `ui-body`, `ui-meta`, `ui-card`, `ui-card-elevated`를 추가한다.
3. `--radius` 기반의 현재 UI가 깨지지 않도록 기존 `app-card*`를 alias로 유지한다.
4. Run: `pnpm typecheck`.

### Task 2: PageFrame·PageHeader·AuthShell 구현

**Files:**
- Create: `src/components/layout/page-frame.tsx`
- Create: `src/components/layout/page-header.tsx`
- Create: `src/components/layout/auth-shell.tsx`

**Steps:**
1. `PageFrame`의 `size` union을 `auth | narrow | standard | wide | full`로 제한한다.
2. `PageHeader`는 eyebrow/title/description/actions을 선택적으로 렌더하고 semantic type utility만 사용한다.
3. `AuthShell`은 로고 slot과 children을 동일한 auth 폭/card 규칙 안에 둔다.
4. Run: `pnpm typecheck`.

### Task 3: app shell과 flow 화면 폭·타입 통일

**Files:**
- Modify: `src/components/layout/app-header.tsx`
- Modify: `src/components/layout/step-progress.tsx`
- Modify: `src/features/goal-intake/components/goal-intake-form.tsx`
- Modify: `src/features/discovery/components/discovery-screen.tsx`
- Modify: `src/features/criteria/components/criteria-screen.tsx`
- Modify: `src/features/job-feed/components/feed-screen.tsx`
- Modify: `src/app/(flow)/feed/[sessionId]/[itemId]/page.tsx`

**Steps:**
1. Header/step progress를 `wide`/`standard` container 규칙으로 맞춘다.
2. Start는 wide, Discovery·Criteria·상세는 narrow, Feed는 standard size를 사용한다.
3. 화면별 inline typography를 semantic utility로 바꾸고 error/loading wrapper도 동일한 frame 폭으로 맞춘다.
4. Run: `pnpm lint && pnpm typecheck`.

### Task 4: public·auth·admin 화면 통일

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/(marketing)/about/page.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/signup/page.tsx`
- Modify: `src/app/session-expired/page.tsx`
- Modify: `src/features/admin/AdminLoginForm.tsx`
- Modify: `src/features/admin/AdminDashboard.tsx`

**Steps:**
1. 랜딩의 헤더·section heading은 semantic type class를 사용한다.
2. 로그인·회원가입은 `AuthShell`을 사용해 logo/card/field hierarchy를 일치시킨다.
3. 소개·세션 만료·관리자 화면을 해당 PageFrame size와 semantic title hierarchy에 맞춘다.
4. Run: `pnpm lint && pnpm typecheck`.

### Task 5: 실제 화면 검증과 문서 갱신

**Files:**
- Modify: `docs/design-system.md` (텍스트가 아닌 경우 새 `docs/design-system-v2.md`를 생성)
- Create/update: `.pr-screenshots/*-design-system.png`

**Steps:**
1. `pnpm build`로 production build를 검증한다.
2. 실제 backend와 frontend를 함께 띄워 Start → Discovery → Criteria → Feed를 데스크톱 및 모바일 viewport에서 확인한다.
3. login, about, session-expired, admin login의 visual QA를 수행한다.
4. 캡처 중 오류 state 또는 API mock 화면이 아닌지 DOM 텍스트로 확인한다.
5. 서버를 모두 종료하고 변경 사항을 검토한다.

## 검증 기준

- 각 화면은 하나의 명시적 content width를 갖는다.
- 페이지 제목·섹션 제목·본문·메타가 `ui-*` semantic class를 사용한다.
- 모바일 padding, desktop padding, card radius/padding이 토큰에서 결정된다.
- 페이지의 데이터 흐름·상태 전환·공고 score/reasons 계약이 변경되지 않는다.
