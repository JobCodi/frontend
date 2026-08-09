"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, ExternalLink, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatDday } from "@/lib/utils/date";
import type { ApplicationStatus, JobApplication } from "@/lib/schemas/application";
import { useApplications, useUpdateJobApplication } from "../queries/use-applications";

const COLUMNS: readonly { status: ApplicationStatus; title: string; description: string }[] = [
  { status: "reviewing", title: "검토 중", description: "지원할지 판단하는 공고" },
  { status: "planned", title: "지원 예정", description: "일정을 정한 공고" },
  { status: "applied", title: "지원 완료", description: "이미 지원한 공고" },
  { status: "closed", title: "종료", description: "더 이상 진행하지 않는 공고" },
];

function toInputDate(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

function datePayload(value: string): string | null {
  return value ? `${value}T00:00:00.000Z` : null;
}

function ApplicationCard({ item }: { item: JobApplication }) {
  const update = useUpdateJobApplication();
  const [note, setNote] = useState(item.note ?? "");
  const deadline = formatDday(item.job.closesAt, item.job.isRolling);

  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{item.job.companyName}</p>
          <h3 className="mt-1 text-base font-semibold leading-snug text-[var(--text)]">{item.job.title}</h3>
        </div>
        {deadline ? <span className={deadline.urgent ? "rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600" : "rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--text-muted)]"}>{deadline.label}</span> : null}
      </div>

      <div className="mt-4 grid gap-2">
        <label className="text-xs font-medium text-[var(--text-muted)]">
          진행 상태
          <select
            value={item.status}
            disabled={update.isPending}
            onChange={(event) => update.mutate({ id: item.id, update: { status: event.target.value as ApplicationStatus } })}
            className="mt-1.5 h-9 w-full rounded-lg border border-[var(--line)] bg-white px-2 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            {COLUMNS.map((column) => <option key={column.status} value={column.status}>{column.title}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          지원 예정일
          <input
            type="date"
            value={toInputDate(item.plannedAt)}
            disabled={update.isPending}
            onChange={(event) => update.mutate({ id: item.id, update: { plannedAt: datePayload(event.target.value) } })}
            className="mt-1.5 h-9 w-full rounded-lg border border-[var(--line)] bg-white px-2 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          />
        </label>
        {item.appliedAt ? <p className="text-xs text-[var(--text-subtle)]">지원일 · {formatDateLong(item.appliedAt)}</p> : null}
        <label className="text-xs font-medium text-[var(--text-muted)]">
          메모
          <textarea
            value={note}
            maxLength={1000}
            rows={2}
            disabled={update.isPending}
            onChange={(event) => setNote(event.target.value)}
            onBlur={() => {
              if (note !== (item.note ?? "")) update.mutate({ id: item.id, update: { note: note.trim() || null } });
            }}
            placeholder="지원 전 확인할 내용을 남겨보세요"
            className="mt-1.5 w-full resize-none rounded-lg border border-[var(--line)] bg-white px-2 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          />
        </label>
      </div>
      <a href={item.job.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] hover:underline">
        원문 공고 열기 <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}

export function ApplicationBoard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data = [], isLoading: isBoardLoading, error } = useApplications(Boolean(user));

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login?redirect=/applications");
  }, [isLoading, router, user]);

  const grouped = useMemo(() => Object.fromEntries(COLUMNS.map((column) => [column.status, data.filter((item) => item.status === column.status)])) as Record<ApplicationStatus, JobApplication[]>, [data]);
  const activeCount = data.filter((item) => item.status === "reviewing" || item.status === "planned").length;
  const appliedCount = data.filter((item) => item.status === "applied").length;
  const deadlineCount = data.filter((item) => item.job.closesAt && formatDday(item.job.closesAt, item.job.isRolling)?.urgent).length;

  if (isLoading || !user) return <div className="mx-auto flex max-w-5xl justify-center px-4 py-20 text-[var(--text-muted)]"><LoaderCircle className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="mx-auto w-full max-w-[var(--content-wide)] px-[var(--page-space-x)] py-8">
      <header className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--brand)]">APPLICATION PIPELINE</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text)]">지원 관리</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">관심 공고를 실제 지원 계획으로 바꾸고, 마감 전에 다음 행동을 정하세요.</p>
          </div>
          <Link href="/start" className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--brand)] px-4 text-sm font-semibold text-white shadow-md shadow-[rgba(84,69,244,0.24)] hover:bg-[var(--brand-strong)]">공고 탐색하기</Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[var(--surface-soft)] p-3"><p className="text-xs text-[var(--text-muted)]">진행 중</p><p className="mt-1 text-xl font-bold text-[var(--text)]">{activeCount}</p></div>
          <div className="rounded-xl bg-[var(--surface-soft)] p-3"><p className="text-xs text-[var(--text-muted)]">마감 임박</p><p className="mt-1 text-xl font-bold text-red-600">{deadlineCount}</p></div>
          <div className="rounded-xl bg-[var(--surface-soft)] p-3"><p className="text-xs text-[var(--text-muted)]">지원 완료</p><p className="mt-1 text-xl font-bold text-[var(--text)]">{appliedCount}</p></div>
        </div>
      </header>

      {isBoardLoading ? <div className="flex justify-center py-20"><LoaderCircle className="h-6 w-6 animate-spin text-[var(--brand)]" /></div> : error ? <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">지원 관리 항목을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p> : data.length === 0 ? (
        <section className="mt-6 flex flex-col items-center rounded-3xl border border-[var(--line)] bg-white px-8 py-16 text-center shadow-[var(--shadow-card)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]"><BriefcaseBusiness className="h-7 w-7" /></div>
          <h2 className="mt-5 text-xl font-bold text-[var(--text)]">아직 관리 중인 지원 공고가 없어요.</h2>
          <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">맞춤 공고에서 가방 아이콘을 눌러 지원 관리에 추가해보세요.</p>
          <Button asChild size="lg" className="mt-6 rounded-xl"><Link href="/start">맞춤 공고 보러가기</Link></Button>
        </section>
      ) : (
        <section aria-label="지원 진행 보드" className="mt-6 grid gap-4 xl:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.status} className="rounded-2xl border border-[var(--line)]/80 bg-[var(--surface-soft)]/80 p-3">
              <div className="mb-3 flex items-start justify-between px-1"><div><h2 className="font-semibold text-[var(--text)]">{column.title}</h2><p className="mt-0.5 text-xs text-[var(--text-subtle)]">{column.description}</p></div><span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[var(--text-muted)]">{grouped[column.status].length}</span></div>
              <div className="space-y-3">{grouped[column.status].map((item) => <ApplicationCard key={item.id} item={item} />)}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
