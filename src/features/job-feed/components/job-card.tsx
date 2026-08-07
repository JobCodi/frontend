import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDday, formatRelativeTime } from "@/lib/utils/date";
import type { JobView } from "../lib/to-job-view";
import { ReasonList } from "./reason-list";

interface JobCardProps {
  job: JobView;
  sessionId: string;
}

const MAX_VISIBLE_REASONS = 3;

export function JobCard({ job, sessionId }: JobCardProps) {
  const dday = formatDday(job.closesAt, job.isRolling);
  const postedLabel = formatRelativeTime(job.postedAt);
  const avatarLetter = job.companyName.charAt(0).toUpperCase();

  return (
    <Link
      href={`/feed/${sessionId}/${job.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/25 hover:shadow-[var(--shadow-elevated)] sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--brand-soft)]/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div className="absolute right-4 top-4 flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.28)]">
        <strong className="text-sm font-bold leading-none">{job.score}</strong>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wide opacity-80">
          match
        </span>
      </div>

      <div className="relative flex items-center gap-3 pr-14">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--surface-soft)] to-white text-base font-bold text-[var(--text)] ring-1 ring-[var(--line)]">
          {avatarLetter}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{job.companyName}</p>
          <p className="truncate text-xs text-[var(--text-subtle)]">{job.sourceLabel}</p>
        </div>
      </div>

      <h3 className="relative mt-4 text-lg font-semibold leading-7 text-[var(--text)]">
        {job.title}
      </h3>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {job.employmentTypeLabel ? (
          <span className="rounded-lg bg-[var(--surface-soft)] px-2 py-1 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]">
            {job.employmentTypeLabel}
          </span>
        ) : null}
        {job.regionLabel ? (
          <span className="rounded-lg bg-[var(--surface-soft)] px-2 py-1 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]">
            {job.regionLabel}
          </span>
        ) : null}
        {job.companySizeLabel ? (
          <span className="rounded-lg bg-[var(--surface-soft)] px-2 py-1 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]">
            {job.companySizeLabel}
            {job.companySizeInferred ? (
              <span className="ml-1 text-[10px] opacity-60">(추정)</span>
            ) : null}
          </span>
        ) : null}
      </div>

      <div className="relative mt-4 flex-1">
        <ReasonList reasons={job.reasons} maxVisible={MAX_VISIBLE_REASONS} />
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
          <span>{postedLabel}</span>
          {job.alsoFoundOnLabels.length > 0 ? (
            <>
              <span>·</span>
              <span>{job.alsoFoundOnLabels.length}개 출처</span>
            </>
          ) : null}
        </div>
        {dday ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              dday.urgent
                ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                : "bg-[var(--surface-soft)] text-[var(--text-muted)]",
            )}
          >
            {dday.label}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
