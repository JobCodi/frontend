import { PageFrame } from "@/components/layout/page-frame";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sessionNotFoundRecovery } from "./session-not-found-recovery";

export const metadata = {
  title: "세션을 열 수 없음 | JobCodi",
};

export default function SessionExpiredPage() {
  return (
    <PageFrame size="narrow" className="relative flex min-h-[70vh] items-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="app-grid absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(84,69,244,0.16),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center rounded-3xl border border-[var(--line)] bg-white px-8 py-12 text-center shadow-[var(--shadow-elevated)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-soft)] to-[#f3e8ff] text-[var(--brand)] shadow-inner">
          <CircleAlert aria-hidden="true" className="h-8 w-8" />
        </div>
        <h1 id="session-not-found-title" className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)]">
          {sessionNotFoundRecovery.title}
        </h1>
        <p id="session-not-found-description" className="mt-3 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
          {sessionNotFoundRecovery.description}
        </p>
        <Button
          asChild
          size="lg"
          className="mt-7 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] px-8 text-white shadow-lg shadow-[rgba(84,69,244,0.25)]"
        >
          <Link
            href={sessionNotFoundRecovery.startHref}
            aria-describedby="session-not-found-title session-not-found-description"
          >
            새로 시작하기
          </Link>
        </Button>
        <Link
          href={sessionNotFoundRecovery.switchAccountHref}
          className="mt-4 text-sm font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-strong)]"
        >
          다른 계정으로 로그인
        </Link>
      </div>
    </PageFrame>
  );
}
