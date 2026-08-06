import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  FileSearch,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContinueBanner } from "@/components/layout/continue-banner";

const EXPLORE_JOBS = ["개발", "디자인", "마케팅", "기획·PM", "데이터", "영업", "인사", "금융"];

const JOB_PREVIEWS = [
  {
    company: "루멘랩스",
    category: "B2B SaaS · 스타트업",
    title: "Backend Engineer",
    meta: "경력 1~4년 · 서울 강남구 · 정규직",
    deadline: "3일 후 마감",
    score: "92",
    reason: "백엔드·성장 단계 조건이 잘 맞아요",
  },
  {
    company: "모멘텀커머스",
    category: "커머스 · 중견기업",
    title: "Product Manager",
    meta: "경력 2~5년 · 서울 성동구 · 정규직",
    deadline: "상시 채용",
    score: "87",
    reason: "선호 직무와 근무 조건을 충족해요",
  },
  {
    company: "플로우데이터",
    category: "데이터 플랫폼 · 스타트업",
    title: "Data Analyst",
    meta: "신입·경력 · 서울 영등포구 · 정규직",
    deadline: "7일 후 마감",
    score: "83",
    reason: "분석 역량과 기업 규모가 맞아요",
  },
];

const FLOW_STEPS = [
  {
    number: "01",
    title: "목표를 알려주세요",
    description: "직무와 원하는 기업 규모부터 고릅니다.",
    icon: Target,
  },
  {
    number: "02",
    title: "AI가 조건을 정리해요",
    description: "짧은 대화로 우선순위를 구체화합니다.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "맞는 공고를 모아드려요",
    description: "여러 채용 출처를 한 화면에서 비교합니다.",
    icon: FileSearch,
  },
];

const TRUST_POINTS = [
  { label: "회원가입 없이", value: "1분 시작" },
  { label: "여러 채용 출처", value: "한 화면" },
  { label: "매칭 근거", value: "투명 공개" },
];

function JobPreviewCard({ job }: { job: (typeof JOB_PREVIEWS)[number] }) {
  return (
    <article className="group flex min-h-52 flex-col rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-tight text-[var(--text)]">{job.company}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{job.category}</p>
        </div>
        <div className="flex min-w-12 flex-col items-center rounded-lg border border-[var(--brand-soft)] bg-[var(--brand-soft)]/70 px-2 py-1.5 text-[var(--brand-strong)]">
          <strong className="text-base leading-4 tabular-nums">{job.score}</strong>
          <span className="mt-0.5 text-[10px] font-medium">매칭</span>
        </div>
      </div>
      <h3 className="mt-5 text-[17px] font-semibold leading-6 tracking-tight text-[var(--text)]">
        {job.title}
      </h3>
      <p className="mt-2 text-sm leading-5 text-[var(--text-muted)]">{job.meta}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-xs">
        <span className="inline-flex items-center gap-1.5 text-[var(--match)]">
          <Check aria-hidden="true" size={14} strokeWidth={2.5} />
          {job.reason}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[var(--text-muted)]">
          <Clock3 aria-hidden="true" size={13} />
          {job.deadline}
        </span>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-[var(--line)] bg-[var(--surface)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 marketing-glow" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 marketing-grid" />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/80 px-3 py-1 text-[12px] font-medium text-[var(--text-muted)] shadow-[var(--shadow-card)] backdrop-blur">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              AI 맞춤 공고 탐색
              <span className="text-[var(--text-subtle)]">·</span>
              회원가입 없이 시작
            </p>

            <h1 className="mt-7 text-balance text-[40px] font-semibold tracking-[-0.05em] text-[var(--text)] sm:text-[56px] sm:leading-[1.05]">
              내 조건에 맞는 공고를
              <br className="hidden sm:block" />
              <span className="text-[var(--text)]"> 더 정확하게 찾으세요</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-[16px] leading-7 text-[var(--text-muted)] sm:text-[17px]">
              원하는 직무와 커리어를 말하면 AI가 조건을 정리하고,
              여러 채용 출처의 공고를 한곳에 모아 우선순위대로 보여드립니다.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-full bg-[var(--text)] px-7 text-[15px] hover:bg-black sm:w-auto"
              >
                <Link href="/start">
                  내 맞춤 공고 찾기
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </Button>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 text-[15px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] sm:w-auto"
              >
                작동 방식 보기
                <ChevronRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-[13px] text-[var(--text-muted)]">
              <BadgeCheck aria-hidden="true" size={16} className="text-[var(--brand)]" />
              카드 등록 없음 · 1분 안에 시작
            </p>

            <div className="mt-6 flex justify-center">
              <Suspense fallback={null}>
                <ContinueBanner />
              </Suspense>
            </div>
          </div>

          {/* Product preview frame */}
          <div className="relative mx-auto mt-14 max-w-4xl lg:mt-16">
            <div className="product-frame overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)]">
              <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[12px] font-medium text-[var(--text-subtle)]">
                  app.jobcodi.kr / discovery
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="border-b border-[var(--line)] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--brand)] text-white">
                        <Compass aria-hidden="true" size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold tracking-tight text-[var(--text)]">
                          나의 탐색 조건
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">AI가 대화로 정리해요</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                      1 / 5
                    </span>
                  </div>

                  <div className="mt-5 rounded-[12px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                    <p className="text-xs font-medium text-[var(--brand-strong)]">첫 번째 질문</p>
                    <p className="mt-2 text-[17px] font-semibold leading-6 tracking-tight text-[var(--text)]">
                      어떤 일을 가장 해보고 싶으세요?
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {["백엔드 개발", "프로덕트 기획", "데이터 분석", "브랜드 마케팅"].map(
                        (option) => (
                          <span
                            key={option}
                            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-center text-sm font-medium text-[var(--text-muted)]"
                          >
                            {option}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-subtle)]">
                    Live criteria
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      ["직무", "백엔드 개발"],
                      ["기업", "성장 중인 팀"],
                      ["지역", "서울 · 경기"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-[12px] border border-[var(--line)] bg-[var(--surface-soft)] p-3"
                      >
                        <p className="text-[11px] font-medium text-[var(--text-muted)]">{label}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-[var(--text)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[12px] border border-[var(--line)] bg-[var(--text)] px-4 py-3.5 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Zap aria-hidden="true" size={15} className="text-white/80" />
                        <span className="text-sm font-medium">조건에 맞는 공고</span>
                      </div>
                      <span className="text-lg font-semibold tabular-nums">
                        128
                        <span className="ml-1 text-xs font-medium text-white/60">개</span>
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {JOB_PREVIEWS.slice(0, 2).map((job) => (
                      <li
                        key={job.title}
                        className="flex items-center justify-between rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text)]">
                            {job.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                            {job.company}
                          </p>
                        </div>
                        <span className="ml-3 shrink-0 rounded-md bg-[var(--brand-soft)] px-2 py-1 text-xs font-semibold text-[var(--brand-strong)]">
                          {job.score}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 border-t border-[var(--line)] pt-8">
            {TRUST_POINTS.map((item) => (
              <div key={item.label} className="text-center">
                <dt className="text-[12px] text-[var(--text-muted)]">{item.label}</dt>
                <dd className="mt-1 text-sm font-semibold tracking-tight text-[var(--text)]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Explore chips */}
      <section
        aria-labelledby="explore-heading"
        className="border-b border-[var(--line)] bg-[var(--surface)] py-8"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="explore-heading" className="text-[14px] font-semibold tracking-tight text-[var(--text)]">
              어떤 커리어를 찾고 있나요?
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              관심 직무를 살펴보고 AI 대화를 시작하세요.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="관심 직무 빠른 탐색">
            {EXPLORE_JOBS.map((job) => (
              <li key={job}>
                <Link
                  href="/start"
                  className="inline-flex min-h-9 items-center rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--text)]/20 hover:bg-[var(--surface)] hover:text-[var(--text)]"
                >
                  {job}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Job previews */}
      <section
        aria-labelledby="preview-heading"
        className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-[var(--brand-strong)]">맞춤 공고 예시</p>
            <h2
              id="preview-heading"
              className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-[34px]"
            >
              조건이 정리되면, 이렇게 보여드려요.
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-[var(--text-muted)]">
              매칭 점수만이 아니라 왜 맞는지와 마감 정보를 함께 확인해,
              지원할 공고를 빠르게 판단할 수 있어요.
            </p>
          </div>
          <Link
            href="/start"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--brand)]"
          >
            내 공고 직접 찾아보기 <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {JOB_PREVIEWS.map((job) => (
            <JobPreviewCard key={`${job.company}-${job.title}`} job={job} />
          ))}
        </div>
        <p className="mt-5 text-sm text-[var(--text-muted)]">
          위 공고는 화면 안내를 위한 예시입니다. 실제 공고는 대화 후 수집 결과에서 확인할 수 있어요.
        </p>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        aria-labelledby="flow-heading"
        className="border-y border-[var(--line)] bg-[var(--surface)]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[13px] font-medium text-[var(--brand-strong)]">JobCodi의 방식</p>
            <h2
              id="flow-heading"
              className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-[36px]"
            >
              검색 전에, 먼저 나를 이해합니다.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[var(--text-muted)]">
              키워드 하나로 수많은 공고를 넘기지 않아도 돼요.
              짧은 대화로 내가 중요하게 생각하는 조건을 정리한 뒤, 그 기준으로 공고를 모아옵니다.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-3">
            {FLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--bg)] p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--text-subtle)]">
                      {step.number}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)]">
                      <Icon aria-hidden="true" size={17} />
                    </span>
                  </div>
                  <h3 className="mt-8 text-[16px] font-semibold tracking-tight text-[var(--text)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{step.description}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/start">
                대화 시작하기
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sources / CTA band */}
      <section
        aria-labelledby="sources-heading"
        className="relative overflow-hidden bg-[var(--text)] py-16 text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 20% 50%, rgba(84,69,244,0.45), transparent 60%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
              <Building2 aria-hidden="true" size={16} />
              신뢰할 수 있는 출처에서 모아요
            </p>
            <h2
              id="sources-heading"
              className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-white sm:text-[28px]"
            >
              고용24 · 사람인 · 기업 채용 페이지를
              <br className="hidden sm:block" />
              한곳에서 확인하세요.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-white text-[var(--text)] hover:bg-white/90"
            >
              <Link href="/start">지금 시작하기</Link>
            </Button>
            <Link
              href="/about"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              공고 출처 자세히 보기
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
