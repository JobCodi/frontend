# 디자인 시스템

## 1. 컴포넌트 계층

```text
components/ui/          shadcn/ui 프리미티브. 직접 작성하기 전에 여기 있는지 먼저 본다
components/layout/      AppHeader, FlowShell, StepProgress
components/feedback/    EmptyState, ErrorState, Skeleton, TypingIndicator
features/<feature>/components/   기능 전용 조합 컴포넌트
```

**새 프리미티브를 만들기 전에 shadcn/ui가 이미 커버하는지 확인한다** (Rules.md). 버튼, 다이얼로그, 슬라이더, 배지, 스켈레톤은 전부 있다.

## 2. 토큰

`src/app/globals.css`의 CSS 변수로 정의하고 Tailwind 테마에 연결한다. 컴포넌트에 색상 리터럴을 반복해 쓰지 않는다.

```css
:root {
  /* 브랜드 */
  --brand:            #5445f4;
  --brand-strong:     #4637db;
  --brand-soft:       #ede9fe;

  /* 표면 */
  --bg:               #f6f7fb;
  --surface:          #ffffff;
  --surface-soft:     #f8fafc;
  --line:             #e2e8f0;

  /* 텍스트 */
  --text:             #0f172a;
  --text-muted:       #64748b;
  --text-subtle:      #94a3b8;

  /* 매칭 근거 (reasons) */
  --match:            #16a34a;   /* kind: match   ✓ */
  --match-soft:       #dcfce7;
  --caution:          #d97706;   /* kind: caution △ */
  --caution-soft:     #fef3c7;
  --gap:              #64748b;   /* kind: gap     ✗ */
  --gap-soft:         #f1f5f9;

  /* 상태 */
  --danger:           #dc2626;
  --danger-soft:      #fee2e2;

  /* 기타 */
  --radius:           12px;
  --shadow-card:      0 1px 2px rgba(15, 23, 42, 0.06),
                      0 8px 24px rgba(15, 23, 42, 0.06);
}
```

### 매칭 근거 색은 의미가 고정되어 있다

`match` / `caution` / `gap`은 제품의 핵심 개념이라 토큰을 따로 둔다. 다른 용도로 재사용하지 않는다.

**색만으로 의미를 전달하지 않는다.** 항상 아이콘 + 텍스트가 함께 간다.

| kind | 아이콘 | 색 토큰 | 예시 |
| --- | --- | --- | --- |
| `match` | ✓ | `--match` | 기술 스택 3개 일치 |
| `caution` | △ | `--caution` | 제외 조건 언급 없음 — 확인 필요 |
| `gap` | ✗ | `--gap` | 경력 3년 이상 요구 |

## 3. 타이포그래피

| 역할 | 크기 / 두께 | 용도 |
| --- | --- | --- |
| `display` | 32/40 · 700 | 랜딩 히어로 |
| `title` | 22/30 · 600 | 화면 제목, 대화 질문 |
| `body` | 15/24 · 400 | 본문 |
| `label` | 13/20 · 500 | 필드 라벨, 배지 |
| `caption` | 12/18 · 400 | 출처, 메타 |

시스템 폰트 스택을 쓴다. 웹폰트를 추가하지 않는다 (LCP).

## 4. 간격

4px 배수. Tailwind 기본 스케일을 그대로 쓴다. 카드 내부 패딩은 `p-5`(20px), 카드 간격은 `gap-3`(12px)를 기본으로 한다.

## 5. 반응형

| 브레이크포인트 | 레이아웃 |
| --- | --- |
| `< 768px` | 단일 컬럼. 대화는 전체 화면. 피드는 세로 카드 |
| `md` (768px+) | 대화 중앙 정렬 `max-w-2xl`. 피드 2컬럼 |
| `lg` (1024px+) | 조건 요약 사이드바 + 본문. 피드 2컬럼 + 필터 사이드바 |

모바일 우선으로 작성한다. `sm:` 접두 없는 스타일이 모바일이다.

## 6. 모션

| 대상 | 처리 |
| --- | --- |
| 화면 전환 | 없음. Next.js 기본 |
| 대화 새 메시지 | `fade-in` 150ms + 아래에서 4px 올라옴 |
| 타이핑 인디케이터 | 점 3개 순차 페이드, 1.2s 루프 |
| 예상 건수 변화 | 숫자 카운트업 400ms |
| 스켈레톤 | shadcn `Skeleton` 기본 펄스 |

`prefers-reduced-motion: reduce`면 전부 즉시 전환으로 바꾼다.

## 7. 접근성 체크리스트

- [ ] 대화 질문 영역이 `aria-live="polite"`
- [ ] 수집 진행 영역이 `role="status"`
- [ ] 선택지 칩이 실제 `<button>` (또는 `role="radio"`/`"checkbox"`)
- [ ] 근거 아이콘에 `aria-hidden="true"`
- [ ] 포커스 링 유지 (`focus-visible`)
- [ ] 본문 대비 4.5:1 이상, 큰 텍스트 3:1 이상
- [ ] 제출 버튼 비활성 시 `aria-disabled` + 이유 텍스트
- [ ] 모달에 포커스 트랩과 `Esc` 닫기

## 8. 브랜드 자산

`public/brand/`에 있다.

| 파일 | 용도 |
| --- | --- |
| `01_primary_horizontal_logo.png` | 헤더, README |
| `03_wordmark_with_tagline.png` | 랜딩 히어로 |
| `05_app_icon_white.png` / `_512.png` | 밝은 배경 아이콘, favicon |
| `06_app_icon_navy.png` / `_512.png` | 어두운 배경 아이콘 |
| `04_dark_banner_logo.png` | 다크 배너 |

## 관련 문서

- [화면 명세](screens.md)
- [제품 개요](product.md)
