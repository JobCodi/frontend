---
description: GitHub Issue 번호를 받아 이슈 우선 워크플로우로 구현한다.
argument-hint: <issue-number>
allowed-tools: Bash(gh issue *), Bash(gh pr *), Bash(git *), Bash(npm *), Read, Edit, Write, Grep, Glob
---

# /fix-issue

이 레포의 이슈 우선 워크플로우로 이슈 하나를 끝까지 처리한다. 반드시 [`AGENTS.md`](../../AGENTS.md)와 정본 상세 규칙 [`Rules.md`](../../Rules.md)를 먼저 따른다.

## 대상 이슈

`#$1`

## 절차

1. **이슈 파악**: `gh issue view $1`로 배경/작업 범위/완료 기준을 읽는다. 요구가 모호하면 진행 전에 질문한다.
2. **브랜치 생성**: 기본 브랜치 `main` 최신화 후 이슈 번호 브랜치를 만든다.
   ```bash
   git switch main && git pull
   git switch -c feat/$1-<short-name>   # 브랜치 타입: feat|fix|docs|refac
   ```
3. **탐색**: 관련 feature(`src/features/*`)와 공용 `lib/`·`components/`를 먼저 읽는다. 기존 패턴·디자인 토큰·유사 구현을 확인한다.
4. **구현**:
   - Server Component 기본, `'use client'`는 상호작용하는 잎 컴포넌트까지.
   - 서버 상태는 TanStack Query, 클라이언트 전용 상태만 Zustand.
   - `score`를 표시하면 `reasons`를 항상 함께 렌더한다. 비어 있으면 렌더하지 않고 에러로 보고한다.
   - 정렬·필터는 서버 쿼리 파라미터로 한다. 클라이언트에서 재계산·재정렬하지 않는다.
   - 폴링은 `refetchInterval` 함수 형태로 한다. `useEffect` 타이머를 만들지 않는다.
   - `POST`는 자동 재시도하지 않는다.
   - `params`/`searchParams`는 `await`한다.
   - `any`, 불필요한 `as`, `@ts-ignore`, non-null 단언(`!`) 금지.
   - 접근성(`aria-live`, `role="status"`, 실제 버튼 칩, `aria-hidden` 아이콘, 포커스 트랩)을 처리한다.
5. **검증** (실제 실행하고 결과를 기록):
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
6. **커밋**: `type: 한글 요약` 형식. 관련 없는 변경을 섞지 않는다.
7. **PR**: 조직 PR 템플릿을 채워 연다. 변경 요약·실제 검증 결과·(UI면) 스크린샷·`Closes #$1`을 포함한다.
   ```bash
   gh pr create --fill --base main
   ```
8. **보고**: 무엇을 바꿨고, 검증 결과가 무엇이며, 남은 확인 사항이 있으면 명시한다.

## 하지 말 것

- 이슈/브랜치 없이 바로 구현하지 않는다.
- 검증을 실행하지 않고 "완료"라고 하지 않는다.
- 요청 범위를 넘는 대규모 리팩터링을 임의로 하지 않는다.
