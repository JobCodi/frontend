import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "로그인 | JobCodi",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-20 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Sparkles aria-hidden="true" size={28} />
        </span>
        <h1 className="text-[24px] font-bold tracking-[-0.03em] text-[var(--text)]">
          JobCodi에 오신 것을 환영해요
        </h1>
        <p className="max-w-sm text-[15px] leading-6 text-[var(--text-muted)]">
          회원가입 없이도 바로 공고 탐색을 시작할 수 있어요.
          로그인하면 대화 내역과 맞춤 공고를 저장해드립니다.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link href="/start">
            로그인 없이 시작하기
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </Button>
        <p className="text-xs text-[var(--text-subtle)]">
          현재는 별도 회원가입 없이 익명 세션으로 운영됩니다.
          관리자는 <Link href="/admin/login" className="underline underline-offset-4 hover:text-[var(--text)]">관리자 로그인</Link>에서 접속하세요.
        </p>
      </div>
    </main>
  );
}
