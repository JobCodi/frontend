# 플로우·UI 작업 프로필

## 변경 전

- 관련 화면 명세는 `docs/screens.md`, 경로 전환은 `docs/sitemap.md`, 디자인 규칙은 `docs/design-system.md`에서 확인한다.
- Server Component를 기본으로 두고, 브라우저 API·이벤트·상호작용이 필요한 가장 작은 컴포넌트만 `'use client'`로 만든다.
- Next.js 15+의 `params`, `searchParams`는 Promise로 await한다.

## 변경 후

- 로딩, 빈 상태, 오류, 세션 만료, 좁은 화면·키보드 흐름을 확인한다.
- 공고 카드에는 점수와 매칭 근거가 함께 보이고, 공고 본문은 표시하지 않는지 확인한다.
- UI 변경은 스크린샷 또는 수동 QA 결과를 남긴다.
- `npm run lint && npm run typecheck && npm run build`를 실행한다.
