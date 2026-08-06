import Image from "next/image";
import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
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
            style={{ height: 24, width: "auto" }}
          />
        </Link>
        <nav aria-label="주요 메뉴" className="flex items-center gap-1 text-sm">
          <Link
            href="/about"
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-[var(--radius)] px-2 py-1"
          >
            소개
          </Link>
          <Link
            href="/login"
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-[var(--radius)] px-2 py-1"
          >
            로그인
          </Link>
          <Link
            href="/start"
            className="ml-2 inline-flex items-center rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 font-medium text-white transition-colors hover:bg-[var(--brand-strong)]"
          >
            시작하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
