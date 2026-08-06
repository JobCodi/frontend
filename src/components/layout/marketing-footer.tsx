import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-[var(--text-muted)] sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 JobCodi. 회원가입 없이 바로 시작할 수 있어요.</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="underline underline-offset-4 hover:text-[var(--text)]">
            서비스 소개
          </Link>
          <Link href="/login" className="underline underline-offset-4 hover:text-[var(--text)]">
            로그인
          </Link>
        </div>
      </div>
    </footer>
  );
}
