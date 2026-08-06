import Image from "next/image";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex">
            <Image
              src="/brand/01_primary_horizontal_logo.png"
              alt="JobCodi"
              width={112}
              height={28}
              style={{ height: 22, width: "auto" }}
            />
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-6 text-[var(--text-muted)]">
            조건을 정리하고, 여러 채용 출처의 공고를 한곳에서 우선순위대로 확인하세요.
          </p>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-wide text-[var(--text)]">제품</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-[var(--text-muted)]">
            <li>
              <Link href="/#how-it-works" className="transition-colors hover:text-[var(--text)]">
                작동 방식
              </Link>
            </li>
            <li>
              <Link href="/start" className="transition-colors hover:text-[var(--text)]">
                맞춤 공고 찾기
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-[var(--text)]">
                공고 출처
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-wide text-[var(--text)]">계정</p>
          <ul className="mt-4 space-y-2.5 text-[13px] text-[var(--text-muted)]">
            <li>
              <Link href="/login" className="transition-colors hover:text-[var(--text)]">
                로그인
              </Link>
            </li>
            <li>
              <Link href="/start" className="transition-colors hover:text-[var(--text)]">
                바로 시작
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="transition-colors hover:text-[var(--text)]">
                관리자
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-[12px] text-[var(--text-subtle)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 JobCodi</p>
          <p>회원가입 없이 바로 시작할 수 있어요.</p>
        </div>
      </div>
    </footer>
  );
}
