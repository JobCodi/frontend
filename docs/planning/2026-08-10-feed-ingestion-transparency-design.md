# Feed 수집 투명성 설계

## 목표

완료되거나 실패한 Feed에서 사용자가 마지막 갱신 시각과 출처별 수집 결과를 공고 목록을 떠나지 않고 확인할 수 있게 한다.

## 배치와 상호작용

- 일일 변화 요약과 조건 비교 아래, Feed 상태·필터·공고 콘텐츠 위에 compact card를 둔다.
- 기본은 접힘 상태다. 실제 `button`이 `aria-expanded`와 `aria-controls`로 상세 목록을 제어한다.
- collecting이거나 `sourceSummary`가 비어 있으면 카드를 표시하지 않는다.
- ready와 failed는 같은 카드와 `SourceSummaryList`를 사용한다.

## 표시 계약

- 카드 요약: Feed `generatedAt`, 확인한 출처 수
- 출처 상세: 이름, 아이콘과 텍스트 상태, succeeded/partial의 `fetched`, 존재하는 `skipReason`
- Backend의 안전한 ISO `checkedAt`이 있으면 확인 시각을 표시하고, 배포 전 응답처럼 없으면 해당 줄만 생략한다.

## 안전 경계

- `score`, `rank`, `reasons`를 계산하거나 정렬하지 않는다.
- raw error와 공고 본문을 카드에 전달하거나 표시하지 않는다.
- 색만으로 상태를 구분하지 않고 아이콘은 장식으로 숨기며 상태 텍스트를 유지한다.
