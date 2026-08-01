# Frontend 에이전트 프로필

`frontend/`에서 작업할 때 이 폴더의 역할별 체크리스트를 사용한다. 먼저 루트 `AGENTS.md`, 이 레포의 `AGENTS.md`, `Rules.md`를 읽고 작업 성격에 맞는 프로필을 추가로 읽는다.

| 프로필 | 사용할 때 |
| --- | --- |
| [`flow-and-ui.md`](./flow-and-ui.md) | 화면, 라우트, 컴포넌트, 상호작용, 디자인·접근성 변경 |
| [`data-and-api.md`](./data-and-api.md) | API 클라이언트, zod 스키마, Query, Zustand, 세션·피드 상태 변경 |
| [`review.md`](./review.md) | 구현 완료 전 사용자 여정과 회귀를 점검할 때 |

프로필은 구현 범위를 설명하는 보조 도구다. 충돌하면 `Rules.md`, 그다음 `AGENTS.md`를 우선한다.

모든 역할 프로필의 작업 소통과 산출물은 한국어로 작성한다. 코드 식별자와 기술 고유 명칭은 예외다.
