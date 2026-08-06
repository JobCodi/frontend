import Image from "next/image";
import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)]/80 glass-header">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            <Image
              src="/brand/01_primary_horizontal_logo.png"
              alt="JobCodi"
              width={112}
              height={28}
              priority
              style={{ height: 22, width: "auto" }}
            />
          </Link>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-1 text-[13px] font-medium sm:flex">
            <Link
              href="/#how-it-works"
              className="rounded-md px-2.5 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              제품
            </Link>
            <Link
              href="/about"
              className="rounded-md px-2.5 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              소개
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <Link
            href="/login"
            className="rounded-md px-2.5 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            로그인
          </Link>
          <Link
            href="/start"
            className="inline-flex h-8 items-center rounded-full bg-[var(--text)] px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
