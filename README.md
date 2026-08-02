# JobCodi Frontend

<p align="center">
  <img src="public/brand/01_primary_horizontal_logo.png" alt="JobCodi" width="520" />
</p>

**JobCodi**는 취준생이 목표를 입력하면 AI가 대화로 검색 조건을 정교화하고, 서버가 수집한 채용 공고를 보여주는 **단일 Next.js 애플리케이션**이다.

> 2026-07-31 전면 개편으로 이전 이력서 업로드·분석·직무 추천·종합 리포트 플로우는 제거됐다.

## 구조

```text
frontend/
├── src/                  Next.js App Router, 컴포넌트, 기능, API 스키마
├── public/               브랜드 자산
├── docs/                 제품·UX·데이터 흐름 정본
├── package.json          Next.js 단일 앱 명령과 의존성
└── pnpm-lock.yaml
```

pnpm을 사용하지만 workspace는 사용하지 않는다. `apps/`, `packages/`, `pnpm-workspace.yaml`은 없다.

## 사용자 흐름

```text
① /start                         목표 입력
② /discovery/:sessionId          AI 대화 (최대 5턴)
③ /discovery/:sessionId/criteria 조건 확인·수정
④ /feed/:sessionId               공고 피드·상세
```

## 시작하기

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

백엔드는 `http://localhost:4000`에서 실행되어야 한다.

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | Next.js 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript strict 검사 |
| `pnpm start` | 빌드된 앱 실행 |
| `pnpm clean` | Next.js 산출물 제거 |

## 환경 변수

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

AI provider credential은 프런트엔드에 두지 않는다. 대화는 백엔드 API를 경유한다.

## 핵심 규칙

- 점수 옆에는 항상 서버가 제공한 매칭 근거가 있어야 한다.
- 점수·순위는 클라이언트에서 재계산하지 않는다.
- 공고 본문을 저장하거나 재노출하지 않는다.
- 외부 공고 링크는 절대 HTTP(S) URL만 허용한다.
- 공고 상세 Query key는 `sessionId`와 `itemId`로 격리한다.
- 서버 상태는 TanStack Query, 클라이언트 전용 상태는 Zustand에 둔다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [제품 개요](docs/product.md) | 프론트 책임 범위·UX 원칙 |
| [사이트맵](docs/sitemap.md) | 라우트와 복귀 처리 |
| [화면 명세](docs/screens.md) | 화면별 상태·API·엣지 케이스 |
| [데이터 흐름](docs/data-flow.md) | Query key·폴링·오류 경계 |
| [디자인 시스템](docs/design-system.md) | 디자인 토큰·컴포넌트 계층 |
