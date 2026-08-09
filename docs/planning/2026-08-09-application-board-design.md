# 지원 관리 보드 설계

**목표:** 관심 공고를 사용자의 실제 지원 파이프라인으로 전환하고, 마감 이전에 다음 행동을 결정하게 한다.

## 사용자 흐름

1. 사용자는 Feed 카드의 **지원 관리에 추가**를 선택한다.
2. 서버는 사용자·공고별 지원 항목을 멱등적으로 만들고 공고를 관심 저장으로 보장한다.
3. `/applications`에서 검토 중, 지원 예정, 지원 완료, 종료 칼럼을 본다.
4. 각 카드에서 상태, 예정일, 지원일, 메모를 수정하거나 원문 공고로 이동한다.
5. 상태를 `applied`로 바꾸면 지원일이 비어 있을 때 현재 시각을 자동 기록한다. 다른 상태로 옮겨도 기록은 삭제하지 않는다.

## 데이터 모델

`user_job_application`

| 필드 | 규칙 |
| --- | --- |
| `id` | UUID primary key |
| `userId` | 인증 사용자의 UUID |
| `job` | `job_posting` FK, 삭제 시 cascade |
| `status` | `reviewing | planned | applied | closed`, 기본 `reviewing` |
| `plannedAt` | 선택적 날짜/시간 |
| `appliedAt` | 선택적 날짜/시간 |
| `note` | 선택적 trim 문자열, 최대 1000자 |
| `createdAt`, `updatedAt` | 서버 기록 |

`(userId, job)`은 unique다. 공고의 본문·이력서·외부 인증정보는 저장하지 않는다.

## API 계약

인증은 모든 endpoint에 필수다.

| Endpoint | 목적 |
| --- | --- |
| `GET /applications` | 사용자의 지원 항목을 상태 순서·예정일·마감일 기준으로 반환 |
| `PUT /jobs/:jobId/application` | 보드에 멱등적으로 추가. 저장 선호도도 `saved`로 설정 |
| `PATCH /applications/:id` | 상태, 예정일, 지원일, 메모의 부분 갱신 |

### A/E/X 사례

| 구분 | 사례 | 기대 결과 |
| --- | --- | --- |
| A | 같은 공고를 두 번 보드에 추가 | 동일 id, 중복 row 없음 |
| A | `applied`로 전환 + `appliedAt` 없음 | 서버 현재 시각 기록 |
| A | 메모와 예정일 수정 | 변경된 값·updatedAt 반환 |
| E | 1001자 메모 | 400 validation error |
| E | 타 사용자 application ID 수정 | 404, 존재 여부 누출 없음 |
| E | 존재하지 않는 job 보드 추가 | 404 JOB_NOT_FOUND |
| X | `applied` 이후 `planned`로 변경 | appliedAt 보존 |
| X | 관심 해제 후 보드 조회 | application은 그대로 유지 |

## UI

- AppHeader에 로그인 사용자를 위한 `지원 관리` 링크를 둔다.
- `/applications`는 인증이 없으면 `/login?redirect=/applications`로 이동한다.
- 상단 KPI: 진행 중(검토/예정), 이번 주 마감, 지원 완료 수.
- 데스크톱은 4열 board, 작은 화면은 1열 섹션으로 자연스럽게 쌓인다.
- 카드: 회사·직무·마감, 원문 열기, 상태 select, 예정일/지원일, 메모 textarea.
- Empty state: Feed의 관심 공고로 이동하는 CTA. 지원 항목이 0개여도 관심 공고 전체를 재조회하지 않는다.

## 검증

- Backend: service idempotency/ownership/auto appliedAt validation tests, controller contract tests, migration.
- Frontend: schema/client/query and board rendering tests, lint/typecheck/build.
- Browser: 로그인 → Feed에서 보드 추가 → `/applications`에서 생성/상태 갱신/원문 CTA를 실제 API와 함께 확인한다.
