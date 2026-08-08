# JobCodi 전 화면 디자인 시스템 정비 설계

## 목적

JobCodi의 랜딩, 인증, 사용자 플로우, 공고 피드, 관리자 화면에 흩어진 폭·여백·타이포그래피·카드 규칙을 하나의 semantic design token과 재사용 가능한 레이아웃 프리미티브로 통일한다. 기존의 보라색 브랜드, 얇은 경계선, 절제된 그라데이션, 높은 정보 밀도는 유지한다.

## 범위

- `/`, `/about`, `/login`, `/signup`, `/session-expired`
- `/start`, `/discovery/[sessionId]`, `/discovery/[sessionId]/criteria`, `/feed/[sessionId]`, 공고 상세 모달/직접 진입 화면
- `/admin/login`, `/admin`
- 앱 셸 헤더와 단계 진행 표시

데이터 계약, API, 세션 상태 머신, 공고 점수·정렬 로직은 변경하지 않는다.

## 설계 토큰

### 컨테이너

| Token | 최대 폭 | 용도 |
| --- | ---: | --- |
| `--content-auth` | 420px | 로그인·회원가입 |
| `--content-narrow` | 768px | 소개, 세션 만료, AI 대화, 조건 확인 |
| `--content-standard` | 1024px | 공고 피드, 기본 페이지 |
| `--content-wide` | 1200px | 목표 입력 2열, 관리자 |
| `--content-full` | 1360px | 향후 데이터 중심 화면 |

공통 수평 패딩은 16px(모바일), 24px(`sm` 이상), 32px(`lg` 이상)이다. 일반 페이지의 수직 패딩은 24px(모바일), 32px(데스크톱)이다.

### 타이포그래피

| Semantic class | 크기 / 줄높이 | 용도 |
| --- | --- | --- |
| `ui-eyebrow` | 11px / 16px | 스텝·제품 카테고리 |
| `ui-page-title` | 28px / 34px | 주요 페이지 제목 |
| `ui-section-title` | 18px / 26px | 카드·섹션 제목 |
| `ui-card-title` | 16px / 24px | 목록 카드 제목 |
| `ui-body` | 14px / 22px | 일반 설명·폼 콘텐츠 |
| `ui-meta` | 12px / 18px | 보조 정보·라벨 |

`ui-page-title`은 작은 화면에서 24px로 낮추고, `sm`부터 28px로 렌더한다. 본문과 메타 정보는 각각 `--text-muted`, `--text-subtle`을 사용한다.

### Surface·spacing

- `--page-space-x`, `--page-space-y`, `--card-space`, `--card-space-lg`를 사용한다.
- 기본 surface는 `ui-card`, 강조된 주요 surface는 `ui-card-elevated` 클래스로 사용한다.
- 일반 카드 라운드는 16px, 큰 페이지 카드 라운드는 20px으로 제한한다. 임의의 `rounded-3xl` 사용은 제거한다.
- 보라색 gradient는 브랜드 행동 CTA와 식별 아이콘에만 사용한다. 텍스트 배경을 과도하게 장식하지 않는다.

## 프리미티브

### `PageFrame`

`size="auth" | "narrow" | "standard" | "wide" | "full"`로 폭을 선택한다. 모든 앱 페이지에서 수평·수직 페이지 여백과 `mx-auto` 규칙을 한 번에 제공한다.

### `PageHeader`

선택적 `eyebrow`, `title`, `description`, `actions`를 받는다. 페이지 헤더에서 제목·설명 위계를 통일한다. Flow의 Step 카드와 관리자의 헤더는 이 의미론적 타입 계층을 공유한다.

### `AuthShell`

일반 사용자 로그인·회원가입을 같은 폭, 로고 처리, 배경, 카드 padding으로 통일한다. 관리자 인증은 별도의 권한 식별을 유지하되 토큰과 type scale을 공유한다.

## 적용 규칙

1. 하드코딩된 `max-w-*`, 페이지 수준 `px-* py-*`, 임의 타이포그래피를 페이지 프리미티브·semantic class로 치환한다.
2. 이미 인터랙션과 데이터 상태를 가진 Feature 컴포넌트는 구조를 변경하지 않고 최상위 프레임·헤더·spacing만 정리한다.
3. 색상 리터럴은 기존의 의미상 예외(브랜드 gradient의 보조 stop 등)를 제외하고 token으로 치환한다.
4. 오류·로딩·빈 상태도 해당 화면의 같은 `PageFrame` 폭 안에서 렌더한다.
5. 키보드 포커스, aria-live, 상태 role 등 기존 접근성 계약을 보존한다.

## 검증

- `pnpm lint`, `pnpm typecheck`, `pnpm build`
- 최소 1440px 및 390px 뷰포트에서 랜딩, 로그인, Start, Discovery, Criteria, Feed, 관리자 인증/대시보드 확인
- 실제 backend 연결이 필요한 Start → Discovery → Criteria → Feed 흐름에서 오류 문구가 렌더되지 않는지 확인
- 대표 화면 스크린샷을 새 파일명으로 저장

## 비범위

- 브랜드 리뉴얼
- API endpoint나 응답 스키마 변경
- 정보 구조와 사용자 플로우 재설계
- 공고 점수/근거 계산 및 클라이언트 재정렬
