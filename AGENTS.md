# AGENTS.md

이 레포는 JobCodi의 Next.js 프론트엔드다.

## 필수 규칙

- 변경 전에 [`Rules.md`](./Rules.md)를 읽고 따른다.
- 역할별 확인 항목은 [`.agents/README.md`](./.agents/README.md)에서 선택한다. 이 문서와 `Rules.md`를 대체하지 않는다.
- **모든 작업 소통은 한국어로 한다.** 사용자 보고, 계획, 이슈, PR, 커밋, 문서, 코드 리뷰는 한국어로 작성한다. 코드 식별자, 명령어, API·라이브러리의 고유 명칭만 필요한 범위에서 영문을 쓴다.
- 여기와 `Rules.md`가 충돌하면 `Rules.md`를 따른다. 사용자가 명시적으로 달리 말한 경우는 예외.
- App Router 패턴을 쓰고 TypeScript strict를 유지한다.
- 기본은 Server Component. `'use client'`는 상호작용하는 잎 컴포넌트까지 내린다.

## 이 레포에서 가장 자주 틀리는 것

### 1. 매칭 근거 없이 점수만 렌더하는 것

백엔드는 모든 공고에 `reasons: MatchReason[]`를 필수로 내려준다. 점수만 있는 카드를 만들면 제품 계약 위반이다. `reasons`가 비어 있으면 렌더하지 말고 에러로 보고한다.

### 2. 클라이언트에서 점수를 재계산하거나 정렬하는 것

`score`, `rank`는 서버 값이다. 정렬·필터는 `?sort=`, `?minScore=`로 서버가 한다. 클라이언트에서 다시 하면 커서 페이지네이션과 어긋난다.

### 3. 공고 본문을 채우려는 것

서버는 공고 본문을 저장하지도 반환하지도 않는다 ([수집 정책](https://github.com/JobCodi/backend/blob/main/docs/architecture/ingestion.md#5-저장-및-재노출-정책)). 상세 화면은 메타데이터 + 근거 + 원문 링크만이다. 없는 필드를 다른 데서 가져오려 하지 않는다.

### 4. 서버 상태를 Zustand에 복제하는 것

TanStack Query 캐시가 정본이다. Zustand는 제출 전 폼 값, 편집 중인 필드 같은 클라이언트 전용 상태만 담는다.

### 5. `useEffect` 타이머로 폴링하는 것

`refetchInterval`의 함수 형태를 쓴다. `status`가 `collecting`이 아니게 되면 자동으로 멈춘다.

### 6. POST를 자동 재시도하는 것

세션 생성과 턴 제출은 재시도하면 중복이 생긴다. `GET`만 재시도한다.

### 7. `params`를 await하지 않는 것

Next.js 15+에서 `params`와 `searchParams`는 Promise다.

## 제거된 것들

전면 개편으로 삭제되었다. 되살리지 않는다.

```text
features/jobcodi-flow/        전체 삭제 (단일 파일 상태 머신)
이력서 업로드 / 이력 분석       삭제
중요도 슬라이더                → 대화 5번째 턴(priorities)으로 흡수
직무 비교 / 종합 리포트         삭제
```

브랜드 자산(`public/brand/`)과 디자인 토큰은 승계한다.

## 작업 순서 (Issue → Branch → PR)

이슈 없이 구현을 시작하지 않는다. `/fix-issue <이슈번호>`([`.claude/commands/fix-issue.md`](./.claude/commands/fix-issue.md))가 아래 절차를 그대로 자동화한다.

1. **이슈 확인·생성**: `gh issue view <n>`으로 배경·범위·완료 기준을 읽는다. 없으면 조직 이슈 템플릿(`feature`/`bug`)으로 새로 만든다. 요구가 모호하면 구현 전에 질문한다.
2. **Notion 동기화** (선택, 팀 작업 시): JobCodi Notion `개발 작업 DB`에 카드가 없으면 만들고, 있으면 상태를 `Ready`→`In Progress`로 옮긴다. 이슈/PR 링크가 생기면 카드에 적어 넣는다.
3. **브랜치 생성**: `main`을 최신화한 뒤 이슈 번호가 들어간 브랜치를 만든다.
   ```bash
   git switch main && git pull
   git switch -c feat/<issue-number>-short-name   # feat|fix|docs|refac
   ```
4. **구현**: 이 문서와 [`Rules.md`](./Rules.md)를 따른다. 관련 없는 변경을 섞지 않는다.
5. **검증** (실제 실행하고 결과를 기록): 아래 [검증](#검증) 섹션의 명령을 전부 통과시킨다.
6. **커밋**: 한글 커밋 메시지, `type: 한글 요약` 형식 ([컨벤션](#컨벤션) 참고). 관련 없는 변경을 한 커밋에 섞지 않는다.
7. **PR**: 조직 PR 템플릿(`.github/PULL_REQUEST_TEMPLATE.md`)을 채워 연다. 검증 결과와 `Closes #<number>`를 반드시 포함한다.
   ```bash
   gh pr create --fill --base main
   ```
8. Notion 카드를 `Review`→(머지 후) `Done`으로 옮기고 검증 결과를 남긴다.

## 컨벤션

- **커밋·PR·이슈·문서는 한글로 쓴다.** 코드 식별자(변수·함수·타입명)와 기술 용어는 영문을 쓴다. 커밋 subject는 `type: 한글 요약` (예: `feat: 목표 입력 폼 구현`), PR 본문은 한글이되 기술 용어는 영문을 섞어도 된다.
- **코드 주석은 WHY만 남긴다.** 무엇을 하는지는 코드 자체로 드러나야 한다 — 숨은 제약, 특정 버그의 우회, 비직관적 동작일 때만 한 줄 주석을 단다.
- 브랜치: `feat|fix|docs|refac/<issue-number>-<kebab-case-slug>`.
- PR 하나는 이슈 하나, 사용자 눈에 보이는 플로우 또는 컴포넌트 영역 하나로 유지한다.
- 백엔드(`JobCodi/backend`)와 동일한 컨벤션을 쓴다 — 두 레포의 `AGENTS.md`는 이 절이 동일해야 한다.

## 검증

완료를 주장하기 전에 실행한다:

```bash
npm run lint && npm run typecheck && npm run build
```

UI가 바뀌었으면 스크린샷이나 짧은 수동 QA 노트를 PR에 포함한다.

## 에이전트 하네스 (`.claude/`)

- [`CLAUDE.md`](./CLAUDE.md) — Claude Code가 세션 시작 시 `@AGENTS.md` · `@Rules.md`를 자동으로 불러오는 얇은 진입점.
- [`.claude/agents/code-reviewer.md`](./.claude/agents/code-reviewer.md) — 코드를 수정하지 않고 이 문서와 `Rules.md` 기준으로 리뷰만 하는 전용 서브에이전트.
- [`.claude/commands/fix-issue.md`](./.claude/commands/fix-issue.md) — `/fix-issue <이슈번호>`. 위 "작업 순서"를 그대로 실행한다.
- `.claude/settings.json` / `.claude/hooks/block-secrets.sh` — 파괴적 삭제(`rm -rf /`)와 `.env`·키 파일 노출·유출을 훅으로 차단한다.

## 역할 프로필 (`.agents/`)

- [`.agents/flow-and-ui.md`](./.agents/flow-and-ui.md) — 화면, 라우트, 상호작용, 접근성 변경
- [`.agents/data-and-api.md`](./.agents/data-and-api.md) — TanStack Query, API 스키마, 세션·피드 흐름 변경
- [`.agents/review.md`](./.agents/review.md) — 사용자 여정과 회귀·접근성 리뷰
