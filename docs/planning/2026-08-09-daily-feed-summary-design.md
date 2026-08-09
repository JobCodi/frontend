# 일일 Feed 변화 요약 설계

## 목표

매일 06:00 KST 활성 프로필 갱신 후 사용자가 다시 앱을 열었을 때, 이전 결과와 비교한 **신규·마감 임박·사라진 공고**를 바로 확인하게 한다.

## 데이터 모델

`daily_feed_summary`는 `ownerUserId + sessionId + refreshDate(KST)`로 유일하다.

- `newCount`: 직전 Feed 항목에는 없고 이번 매칭에 새로 등장한 공고 수
- `closingSoonCount`: 이번 Feed의 마감 전 D-3 이내 공고 수
- `removedCount`: 직전 Feed 항목에는 있었으나 이번 매칭에는 없는 공고 수
- `generatedAt`: 갱신 완료 시각

공고 ID 목록이나 공고 본문은 summary에 중복 저장하지 않는다. 첫 수집(이전 Feed 항목이 없음)은 baseline이므로 0/0/0을 기록한다.

## 계산 경계

- **포함:** `ProfileRefreshSchedulerService`가 시작한 성공적 일일 갱신만 기록
- **제외:** 사용자의 수동 Feed refresh, collection failure, 익명 session
- 새/사라짐은 `job_feed_item.posting` ID 집합 비교로 계산한다.
- 마감 임박은 이번 매칭 결과의 `now < closesAt <= now + 3 days`, `isRolling=false`로 계산한다.

## API

```text
GET /api/v1/profiles/active/daily-summary
Authorization: Bearer <token>
```

```ts
{ summary: null | {
  refreshDate: string; generatedAt: string;
  newCount: number; closingSoonCount: number; removedCount: number;
} }
```

| 경우 | 결과 |
| --- | --- |
| A: 오늘 성공한 active profile 갱신 | 200 + summary |
| E: 오늘 요약 없음/활성 프로필 없음 | 200 + `{ summary: null }` |
| X: 인증 없음 | 401 |

## UX

- Feed 상단에 `오늘의 변화` compact card를 렌더한다.
- `신규 N`, `마감 임박 N`, `사라진 공고 N`을 수치로 표기한다.
- summary 없음은 UI를 숨긴다. 실패/로딩은 Feed를 막지 않는다.
- 신규/사라짐의 상세 목록·알림 발송은 후속 범위다.
