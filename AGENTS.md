# AGENTS.md

이 레포는 JobCodi의 Next.js 프론트엔드다.

## 필수 규칙

- 변경 전에 [`Rules.md`](./Rules.md)를 읽고 따른다.
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

## Issue 기반 워크플로

- 작업은 GitHub Issue에서 시작한다.
- 코딩 전에 이슈 번호와 범위를 확인한다.
- 브랜치명에 이슈 번호를 넣는다: `feat/18-discovery-turn-ui`.
- PR은 `Closes #<number>` 또는 `Refs #<number>`로 이슈를 링크한다.
- 관련 없는 이슈를 한 PR에 섞지 않는다.

## 검증

완료를 주장하기 전에 실행한다:

```bash
npm run lint && npm run typecheck && npm run build
```

UI가 바뀌었으면 스크린샷이나 짧은 수동 QA 노트를 PR에 포함한다.
