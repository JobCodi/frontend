import Image from "next/image";
import Link from "next/link";

export function AppHeader() {
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
        <nav aria-label="주요 메뉴" className="text-sm">
          <Link
            href="/about"
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] rounded-[var(--radius)] px-2 py-1"
          >
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
