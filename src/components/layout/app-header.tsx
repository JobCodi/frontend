"use client";

import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import { DeadlineReminderMenu } from "@/features/job-applications/components/deadline-reminder-menu";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user, logout } = useAuth();
  const initial = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)]/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[var(--content-wide)] items-center justify-between gap-4 px-[var(--page-space-x)]">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
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
          <nav aria-label="주요 메뉴" className="hidden items-center gap-1 text-sm sm:flex">
            <Link
              href="/start"
              className="rounded-lg px-3 py-1.5 font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              탐색
            </Link>
            <Link
              href="/applications"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              지원 관리
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-3 py-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              소개
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <DeadlineReminderMenu enabled={Boolean(user)} />
              <div className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] py-1 pl-1 pr-3 sm:flex">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-xs font-semibold text-white"
                >
                  {initial}
                </span>
                <span className="max-w-[180px] truncate text-sm text-[var(--text-muted)]">
                  {user.email}
                </span>
              </div>
              <Button
                onClick={logout}
                size="sm"
                variant="secondary"
                className="gap-1.5 rounded-lg border-[var(--line)] bg-white shadow-sm"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
