import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "로그인 | JobCodi",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 marketing-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 marketing-grid opacity-70" />

      <div className="relative w-full max-w-[420px]">
        <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow-elevated)] sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/brand/06_app_icon_navy_512.png"
              alt=""
              width={48}
              height={48}
              className="rounded-xl"
              aria-hidden="true"
            />
            <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-[var(--text)]">
              JobCodi에 로그인
            </h1>
            <p className="mt-2 max-w-sm text-[14px] leading-6 text-[var(--text-muted)]">
              지금은 회원가입 없이 익명 세션으로 바로 시작할 수 있어요.
              대화 내역은 24시간 동안 유지됩니다.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button asChild size="lg" className="h-11 w-full rounded-full bg-[var(--text)] hover:bg-black">
              <Link href="/start">
                로그인 없이 계속하기
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-11 w-full rounded-full">
              <Link href="/about">서비스 소개 보기</Link>
            </Button>
          </div>

          <div className="mt-8 border-t border-[var(--line)] pt-6 text-center text-[12px] leading-5 text-[var(--text-subtle)]">
            관리자 계정이 있으신가요?{" "}
            <Link
              href="/admin/login"
              className="font-medium text-[var(--text)] underline-offset-4 hover:underline"
            >
              관리자 로그인
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
