import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDday, formatRelativeTime } from "@/lib/utils/date";
import type { JobView } from "../lib/to-job-view";
import { ReasonList } from "./reason-list";

interface JobCardProps {
  job: JobView;
  sessionId: string;
}

const MAX_VISIBLE_REASONS = 4;

export function JobCard({ job, sessionId }: JobCardProps) {
  const dday = formatDday(job.closesAt, job.isRolling);
  const postedLabel = formatRelativeTime(job.postedAt);

  return (
    <Link
      href={`/feed/${sessionId}/${job.id}`}
      className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
    >
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
        {job.employmentTypeLabel ? <span>{job.employmentTypeLabel}</span> : null}
        {job.companySizeLabel ? (
          <span className="flex items-center gap-1">
            · {job.companySizeLabel}
            {job.companySizeInferred ? (
              <Badge variant="neutral" className="px-1.5 py-0 text-[10px]">
                추정
              </Badge>
            ) : null}
          </span>
        ) : null}
        {job.regionLabel ? <span>· {job.regionLabel}</span> : null}
        {dday ? (
          <Badge
            variant={dday.urgent ? "danger" : "neutral"}
            className={cn("ml-auto", dday.urgent && "font-semibold")}
          >
            {dday.label}
          </Badge>
        ) : null}
      </div>

      <div>
        <p className="text-[15px] font-semibold leading-6 text-[var(--text)]">{job.title}</p>
        <p className="text-sm text-[var(--text-muted)]">{job.companyName}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold text-[var(--brand-strong)]">{job.score}점</p>
        <ReasonList reasons={job.reasons} maxVisible={MAX_VISIBLE_REASONS} />
      </div>

      <p className="text-xs text-[var(--text-subtle)]">
        {job.sourceLabel}
        {postedLabel ? ` · ${postedLabel}` : ""}
        {job.alsoFoundOnLabels.length > 0
          ? ` · ${job.alsoFoundOnLabels.join(", ")}에도 게시`
          : ""}
      </p>
    </Link>
  );
}
