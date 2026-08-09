"use client";

import Link from "next/link";
import { Bell, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { formatDday } from "@/lib/utils/date";
import { useDeadlineReminders } from "../queries/use-deadline-reminders";

export function DeadlineReminderMenu({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useDeadlineReminders(enabled);
  const reminders = data?.reminders ?? [];

  if (!enabled) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="deadline-reminder-menu"
        aria-label={reminders.length > 0 ? `마감 임박 알림 ${reminders.length}건` : "마감 임박 알림"}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--text-muted)] shadow-sm transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
      >
        <Bell className="h-4 w-4" />
        {reminders.length > 0 ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{reminders.length > 9 ? "9+" : reminders.length}</span> : null}
      </button>

      {open ? (
        <section id="deadline-reminder-menu" aria-label="마감 임박 공고" className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-xl">
          <div className="border-b border-[var(--line)] px-4 py-3"><p className="text-sm font-semibold text-[var(--text)]">마감 임박</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">지원 중인 공고 중 3일 이내 마감</p></div>
          {isLoading ? <div className="flex justify-center p-7"><LoaderCircle className="h-5 w-5 animate-spin text-[var(--brand)]" /></div> : isError ? <p className="p-4 text-sm text-red-600">알림을 불러오지 못했어요.</p> : reminders.length === 0 ? <p className="p-4 text-sm text-[var(--text-muted)]">마감 임박 공고가 없어요.</p> : <ul className="max-h-80 overflow-y-auto p-2">{reminders.slice(0, 5).map((reminder) => {
            const dday = formatDday(reminder.job.closesAt, false);
            return <li key={reminder.id}><Link href="/applications" onClick={() => setOpen(false)} className="block rounded-xl p-3 transition-colors hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--text)]">{reminder.job.companyName}</p><p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{reminder.job.title}</p></div><span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">{dday?.label ?? "마감 임박"}</span></div></Link></li>;
          })}</ul>}
          <div className="border-t border-[var(--line)] p-2"><Link href="/applications" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-[var(--brand)] hover:bg-[var(--brand-soft)]">지원 관리 열기</Link></div>
        </section>
      ) : null}
    </div>
  );
}
