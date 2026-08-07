import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "세션 만료 | JobCodi",
};

export default function SessionExpiredPage() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden px-4 py-16 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="app-grid absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(84,69,244,0.16),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center rounded-3xl border border-[var(--line)] bg-white px-8 py-12 text-center shadow-[var(--shadow-elevated)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-soft)] to-[#f3e8ff] text-[var(--brand)] shadow-inner">
          <Clock3 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)]">
          세션이 만료되었어요.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
          대화 내용은 24시간 동안만 보관됩니다.
          <br />
          다시 시작하면 금방 끝나요.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-7 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] px-8 text-white shadow-lg shadow-[rgba(84,69,244,0.25)]"
        >
          <Link href="/start">새로 시작하기</Link>
        </Button>
      </div>
    </main>
  );
}
