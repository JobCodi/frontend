# AGENTS.md

이 레포는 JobCodi의 pnpm 기반 Next.js 모노레포다. 배포 가능한 웹 앱은 `apps/web`에 있다.

## 필수 규칙

- 변경 전 [`Rules.md`](./Rules.md)를 읽고 따른다. 역할별 확인 항목은 [`.agents/README.md`](./.agents/README.md)에서 선택하며 이 문서와 `Rules.md`를 대체하지 않는다. 여기와 `Rules.md`가 충돌하면 `Rules.md`를 따른다.
- 사용자 보고·계획·이슈·PR·커밋·문서·코드 리뷰는 한국어로 작성한다. 코드 식별자·명령어·API와 라이브러리 고유 명칭은 필요한 범위에서 영문을 사용한다.
- App Router·TypeScript strict를 유지한다. Next.js 실행 앱의 코드는 `apps/web` 아래에 둔다. 기본은 Server Component이며 `'use client'`는 상호작용하는 잎까지 내린다.
- 매칭의 `score`, `rank`, `reasons`는 백엔드 정본이다. 클라이언트에서 재계산·재정렬하지 않는다. `reasons`가 비어 있으면 렌더하지 말고 오류로 처리한다.
- 공고 본문을 저장·재노출하지 않는다. 상세는 메타데이터·매칭 근거·원문 링크만 제공한다.
- 서버 상태는 TanStack Query, 제출 전 폼 값 등 클라이언트 전용 상태만 Zustand에 둔다.
- `refetchInterval` 함수로만 수집 상태를 폴링하고, POST 요청은 자동 재시도하지 않는다.
- Next.js 15+ `params`와 `searchParams`는 Promise로 await한다.

## 제품 전환 경계

구형 이력서 분석·직무 추천 화면은 전면 전환으로 삭제되었다. 되살리지 않는다.

```text
features/jobcodi-flow/    삭제
이력서 업로드/이력 분석    삭제
직무 비교/종합 리포트      삭제
```

브랜드 자산과 디자인 토큰은 승계한다.

## 작업 순서

- 작업은 GitHub Issue에서 시작하고 브랜치명에 이슈 번호를 포함한다. PR은 `Closes #<number>` 또는 `Refs #<number>`로 연결하며 관련 없는 변경을 섞지 않는다.
- 작업 전 JobCodi Notion `개발 작업 DB` Kanban 카드를 생성·갱신한다. 범위, 상태, 우선순위, Sprint, 관련 GitHub Issue/PR, 저장소 링크, 담당자, 완료 기준을 기록하고 `Ready` → `In Progress` → `Review` → `Done`으로 이동한다.
- 커밋 제목은 conventional type prefix를 유지하되 한국어로 작성한다. 코드 주석은 WHY만 남긴다.
- Notion 자격 증명을 코드·문서·커밋·Issue·PR·로그에 남기지 않는다.

## 검증

완료 주장 전 실행한다.

```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm build
```

UI가 바뀌면 스크린샷 또는 짧은 수동 QA 노트를 PR에 남긴다.

## 에이전트 하네스와 역할 프로필

- [`CLAUDE.md`](./CLAUDE.md)는 Claude Code용 진입점이다.
- [`.claude/agents/code-reviewer.md`](./.claude/agents/code-reviewer.md)는 읽기 전용 리뷰용 서브에이전트다.
- [`.claude/commands/fix-issue.md`](./.claude/commands/fix-issue.md)는 Issue → Branch → PR 흐름을 자동화한다.
- `.claude/settings.json`과 hooks는 파괴적 삭제와 `.env`·키 파일 유출을 막는다.
- [`.agents/flow-and-ui.md`](./.agents/flow-and-ui.md)는 화면·라우트·상호작용·접근성 변경, [`.agents/data-and-api.md`](./.agents/data-and-api.md)는 TanStack Query·API 스키마·세션·피드 흐름 변경, [`.agents/review.md`](./.agents/review.md)는 사용자 여정·회귀·접근성 리뷰에 사용한다.
