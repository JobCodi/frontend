# 프로필 조건 버전 비교 설계

## 목표

맞춤 Feed에서 현재 조건이 직전 조건보다 어떤 필드를 바꾸었고, 서버 기준 검색 가능 공고 수가 어떻게 달라졌는지 보여준다.

## 표시

- 현재 조건 version과 추정 공고 수
- 직전 version과 추정 공고 수
- 증감 수
- 바뀐 핵심 조건: 희망 직무, 지역, 고용형태, 기술 스택, 제외 조건
- version이 하나면 비교 카드를 표시하지 않는다.

## 경계

- count는 Backend 기준이며 브라우저에서 계산하지 않는다.
- 조건 payload는 코드가 아니라 label resolver를 거친 요약만 보여준다.
- API loading/error/empty는 Feed를 막지 않는다.
- 조건 version 비교는 기존 조건 편집 lifecycle을 변경하지 않는다.
