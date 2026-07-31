# 사이트맵

## 1. 전체 구조

```text
/                                    랜딩
│
├── /start                           ① 목표 입력
│
├── /discovery/[sessionId]           ② AI 대화 (5턴)
│   └── /criteria                    ③ 조건 확인·수정
│
├── /feed/[sessionId]                ④ 공고 피드
│   └── /[itemId]                    ④-1 공고 상세 (인터셉트 라우트 → 모달)
│
├── /about                           서비스 소개 + 공고 출처·수집 정책
└── /session-expired                 만료된 세션 안내
```

라우트 그룹:

```text
src/app/
├── layout.tsx
├── page.tsx                          /
├── (marketing)/
│   ├── about/page.tsx                /about
│   └── _components/
├── (flow)/
│   ├── layout.tsx                    진행 표시줄이 있는 공통 셸
│   ├── start/page.tsx                /start
│   ├── discovery/[sessionId]/
│   │   ├── page.tsx                  /discovery/:id
│   │   └── criteria/page.tsx         /discovery/:id/criteria
│   └── feed/[sessionId]/
│       ├── page.tsx                  /feed/:id
│       ├── @modal/(.)[itemId]/page.tsx   인터셉트 → 모달
│       └── [itemId]/page.tsx         직접 진입 시 전체 페이지
└── session-expired/page.tsx
```

## 2. 라우트 명세

| 경로 | 렌더링 | 인증 | 목적 |
| --- | --- | --- | --- |
| `/` | Server | 없음 | 가치 제안, `/start` 진입 |
| `/start` | Server + Client 폼 | 없음 | 목표 입력 → 세션 생성 |
| `/discovery/:sessionId` | Client | 세션 ID | 5턴 대화 |
| `/discovery/:sessionId/criteria` | Server (초기) + Client (편집) | 세션 ID | 확정 조건 검토·수정·확정 |
| `/feed/:sessionId` | Client (폴링) | 세션 ID | 수집 진행 → 공고 목록 |
| `/feed/:sessionId/:itemId` | Server | 세션 ID | 공고 상세 |
| `/about` | Server (정적) | 없음 | 서비스 소개, 공고 출처, 수집 정책 |
| `/session-expired` | Server (정적) | 없음 | 24시간 만료 안내 |

**세션 ID가 사실상의 자격 증명이다.** URL에 노출되므로 공유 시 다른 사람이 같은 세션을 볼 수 있다. MVP에서는 이를 감수하되, `/about`에 명시한다.

## 3. 플로우 다이어그램

```text
        ┌─────────┐
        │    /    │  랜딩
        └────┬────┘
             │ [시작하기]
             ↓
        ┌─────────┐
        │ /start  │  목표 입력 폼
        └────┬────┘
             │ POST /sessions  →  sessionId + 첫 질문
             ↓
   ┌─────────────────────┐
   │ /discovery/:id      │  ←─┐
   │  턴 1 → 2 → 3 → 4 → 5 │  │ POST /sessions/:id/turns
   └──────────┬──────────┘  ─┘  (status: interviewing이면 반복)
              │ status: criteria_ready
              ↓
   ┌─────────────────────────┐
   │ /discovery/:id/criteria │  조건 검토
   │   [수정] → PATCH        │
   └──────────┬──────────────┘
              │ POST /criteria/confirm → 202
              ↓
   ┌─────────────────────┐
   │ /feed/:id           │  status: collecting → 폴링 (2초)
   │   수집 중 스켈레톤   │
   │        ↓            │
   │   공고 목록          │  status: ready
   └──────────┬──────────┘
              │ 카드 클릭
              ↓
   ┌─────────────────────┐
   │ /feed/:id/:itemId   │  상세 (모달) → [원문 보기] 새 탭
   └─────────────────────┘
```

## 4. 이탈·복귀 처리

세션 ID는 `localStorage`의 `jobcodi.session`에 저장한다.

| 상황 | 처리 |
| --- | --- |
| 대화 중 이탈 후 재진입 | 랜딩에서 "이어서 하기" 배너 노출 → 마지막 단계로 복귀 |
| 세션 만료 (24시간) | API 404 → `/session-expired`로 리다이렉트, 새로 시작 유도 |
| 대화 완료 후 재방문 | 피드로 바로 이동. "조건 다시 보기" 링크 제공 |
| 다른 기기에서 열기 | 세션 ID를 모르면 불가. 새로 시작 |

복귀 지점은 세션 `status`로 결정한다.

```text
interviewing        → /discovery/:id
criteria_ready      → /discovery/:id/criteria
collecting | ready  → /feed/:id
collection_failed   → /feed/:id  (재시도 UI)
abandoned | 404     → /session-expired
```

## 5. 제거된 라우트

전면 개편으로 삭제된 이전 화면들. 되살리지 않는다.

```text
이력서 업로드          삭제
이력 분석 결과         삭제
중요도 슬라이더        → 대화 5번째 턴(priorities)으로 흡수
직무 비교              삭제
종합 리포트            삭제
마이페이지             post-MVP
```

## 관련 문서

- [제품 개요](product.md)
- [화면 명세](screens.md)
- [데이터 흐름](data-flow.md)
