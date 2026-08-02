import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContinueBanner } from "@/components/layout/continue-banner";

const STEPS = [
  { title: "① 목표 입력", description: "기업 규모와 직군을 골라요." },
  { title: "② AI 대화", description: "AI가 5번 물어보고 조건을 정리해요." },
  { title: "③ 조건 확인", description: "정리된 조건을 확인하고 고쳐요." },
  { title: "④ 공고 모아보기", description: "여러 채용 사이트의 공고를 모아드려요." },
];

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center">
        <Image
          src="/brand/03_wordmark_with_tagline.png"
          alt="JobCodi"
          width={320}
          height={80}
          priority
          style={{ width: "min(320px, 80%)", height: "auto" }}
        />
        <h1 className="text-[32px] font-bold leading-[40px] text-[var(--text)]">
          목표만 알려주세요.
          <br />
          공고는 저희가 모아옵니다.
        </h1>
        <p className="max-w-xl text-[15px] leading-6 text-[var(--text-muted)]">
          기업 규모와 직군을 고르면, AI가 5번 물어보고 조건을 정리해 여러 채용
          사이트에서 공고를 모아 드려요.
        </p>
        <Button asChild size="lg">
          <Link href="/start">시작하기 →</Link>
        </Button>
        <Suspense fallback={null}>
          <ContinueBanner />
        </Suspense>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--surface)] py-12">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-[var(--text)]">{step.title}</p>
              <p className="text-sm text-[var(--text-muted)]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-4 text-center text-sm text-[var(--text-muted)]">
          <p>공고 출처: 고용24 · 사람인 · 기업 채용 페이지</p>
          <p>회원가입 없이 바로 시작할 수 있어요.</p>
          <Link href="/about" className="underline underline-offset-4 hover:text-[var(--text)]">
            서비스 소개 및 공고 출처 자세히 보기
          </Link>
        </div>
      </footer>
    </main>
  );
}
