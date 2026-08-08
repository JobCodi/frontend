import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  FileSearch,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";

const EXPLORE_JOBS = ["개발", "디자인", "마케팅", "기획·PM", "데이터", "영업", "인사", "금융"];

const JOB_PREVIEWS = [
  {
    company: "루멘랩스",
    logo: "L",
    category: "B2B SaaS · 스타트업",
    title: "Backend Engineer",
    meta: "경력 1~4년 · 서울 강남구 · 정규직",
    deadline: "3일 후 마감",
    score: "92",
    reason: "백엔드·성장 단계 조건이 잘 맞아요",
    tags: ["Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    company: "모멘텀커머스",
    logo: "M",
    category: "커머스 · 중견기업",
    title: "Product Manager",
    meta: "경력 2~5년 · 서울 성동구 · 정규직",
    deadline: "상시 채용",
    score: "87",
    reason: "선호 직무와 근무 조건을 충족해요",
    tags: ["B2C", "그로스", "데이터 기반"],
  },
  {
    company: "플로우데이터",
    logo: "F",
    category: "데이터 플랫폼 · 스타트업",
    title: "Data Analyst",
    meta: "신입·경력 · 서울 영등포구 · 정규직",
    deadline: "7일 후 마감",
    score: "83",
    reason: "분석 역량과 기업 규모가 맞아요",
    tags: ["Python", "SQL", "Tableau"],
  },
  {
    company: "넥스트웨이브",
    logo: "N",
    category: "핀테크 · 스타트업",
    title: "Frontend Engineer",
    meta: "경력 2~4년 · 서울 서초구 · 정규직",
    deadline: "5일 후 마감",
    score: "89",
    reason: "React 경험과 팀 문화가 맞아요",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    company: "클라우드브릿지",
    logo: "C",
    category: "클라우드 · 중견기업",
    title: "DevOps Engineer",
    meta: "경력 3~6년 · 서울 판교 · 정규직",
    deadline: "상시 채용",
    score: "85",
    reason: "AWS·K8s 역량이 요구사항에 부합해요",
    tags: ["AWS", "Kubernetes", "Terraform"],
  },
  {
    company: "인사이트AI",
    logo: "I",
    category: "AI · 스타트업",
    title: "ML Engineer",
    meta: "경력 1~3년 · 서울 강남구 · 정규직",
    deadline: "10일 후 마감",
    score: "91",
    reason: "LLM·파이썬 경험이 잘 맞아요",
    tags: ["PyTorch", "LLM", "Python"],
  },
];

const FLOW_STEPS = [
  { number: "01", title: "목표를 알려주세요", description: "직무와 원하는 기업 규모부터 고릅니다.", icon: Target },
  { number: "02", title: "AI가 조건을 정리해요", description: "5번의 짧은 대화로 우선순위를 구체화합니다.", icon: Sparkles },
  { number: "03", title: "맞는 공고를 모아드려요", description: "여러 채용 출처를 한 화면에서 비교합니다.", icon: FileSearch },
];

const STATS = [
  { value: "10,000+", label: "수집된 공고" },
  { value: "98%", label: "매칭 정확도" },
  { value: "3분", label: "평균 탐색 시간" },
];

function JobPreviewCard({ job }: { job: (typeof JOB_PREVIEWS)[number] }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50">
      {/* Score badge */}
      <div className="absolute -right-2 -top-2 flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
        <strong className="text-sm font-bold leading-none">{job.score}</strong>
        <span className="text-[9px] font-medium opacity-80">match</span>
      </div>

      {/* Company */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 text-base font-bold text-gray-600 ring-1 ring-gray-200/50">
          {job.logo}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{job.company}</p>
          <p className="text-xs text-gray-500">{job.category}</p>
        </div>
      </div>

      {/* Job info */}
      <h3 className="mt-5 text-lg font-semibold text-gray-900">{job.title}</h3>
      <p className="mt-1.5 text-sm text-gray-500">{job.meta}</p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <Check aria-hidden="true" size={14} strokeWidth={2.5} />
          {job.reason}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-gray-400">
          <Clock3 aria-hidden="true" size={12} />
          {job.deadline}
        </span>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-white">
      {/* ===== HERO ===== */}
      <section className="relative">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-indigo-100/80 via-purple-50/60 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tl from-blue-50 via-cyan-50/50 to-transparent blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 lg:pt-32">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
            <Sparkles aria-hidden="true" size={16} className="text-indigo-500" />
            AI가 조건을 정리하고, 공고를 모아드려요
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            내 조건에 맞는 공고,
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}더 똑똑하게{" "}
            </span>
            찾으세요
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            원하는 직무와 커리어를 말하면 AI가 조건을 정리하고,
            <br className="hidden sm:block" />
            여러 채용 출처의 공고를 한곳에 모아 우선순위대로 보여드려요.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-200/50 transition-all hover:shadow-xl hover:shadow-indigo-300/50"
            >
              무료로 시작하기
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-13 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-8 text-base font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              어떻게 작동하나요
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck aria-hidden="true" size={16} className="text-indigo-500" />
              회원가입 30초
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield aria-hidden="true" size={16} className="text-indigo-500" />
              정부 공식 API 기반
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap aria-hidden="true" size={16} className="text-indigo-500" />
              3분이면 맞춤 공고
            </span>
          </div>

          {/* Stats */}
          <div className="mt-16 grid w-full max-w-xl grid-cols-3 gap-8 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JOB PREVIEWS ===== */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <TrendingUp size={14} />
              맞춤 공고 예시
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              조건이 정리되면, 이렇게 보여드려요
            </h2>
            <p className="mt-4 max-w-2xl text-gray-600">
              매칭 점수만이 아니라 왜 맞는지와 마감 정보를 함께 확인해, 지원할 공고를 빠르게 판단할 수 있어요.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_PREVIEWS.map((job) => (
              <JobPreviewCard key={`${job.company}-${job.title}`} job={job} />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            위 공고는 화면 안내를 위한 예시입니다. 실제 공고는 대화 후 수집 결과에서 확인할 수 있어요.
          </p>
        </div>
      </section>

      {/* ===== EXPLORE BY CATEGORY ===== */}
      <section className="border-t border-gray-100 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h3 className="text-lg font-semibold text-gray-900">어떤 커리어를 찾고 있나요?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {EXPLORE_JOBS.map((job) => (
              <Link
                key={job}
                href="/signup"
                className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {job}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="border-t border-gray-100 bg-gray-50/50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Compass size={14} />
              JobCodi의 방식
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              검색 전에, 먼저 나를 이해합니다
            </h2>
            <p className="mt-4 max-w-2xl text-gray-600">
              키워드 하나로 수많은 공고를 넘기지 않아도 돼요. 짧은 대화로 내가 중요하게 생각하는 조건을 정리한 뒤, 그 기준으로 공고를 모아옵니다.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 sm:grid-cols-3">
            {FLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.number} className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-600">{step.number}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <Icon aria-hidden="true" size={20} className="text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-gray-600">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ===== TRUSTED SOURCES ===== */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Globe aria-hidden="true" size={24} className="text-indigo-600" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900">신뢰할 수 있는 출처에서 모아요</h2>
            <p className="mt-3 max-w-xl text-gray-600">
              고용24 · 사람인 · 기업 채용 페이지 등 다양한 채용 출처를 확인합니다.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              공고 출처 자세히 보기 <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            30초 회원가입으로 AI 채용 비서를 만나보세요.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-100"
          >
            무료로 시작하기
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">JobCodi</span>
            </div>
            <nav className="flex gap-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-900">소개</Link>
              <Link href="/login" className="hover:text-gray-900">로그인</Link>
              <Link href="/signup" className="hover:text-gray-900">회원가입</Link>
            </nav>
            <p className="text-xs text-gray-400">© 2025 JobCodi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
