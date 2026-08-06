import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDday, formatRelativeTime } from "@/lib/utils/date";
import { Check } from "lucide-react";
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

  // Extract first letter for avatar
  const avatarLetter = job.companyName.charAt(0).toUpperCase();

  return (
    <Link
      href={`/feed/${sessionId}/${job.id}`}
      className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50"
    >
      {/* Score badge - top right */}
      <div className="absolute -right-2 -top-2 flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
        <strong className="text-sm font-bold leading-none">{job.score}</strong>
        <span className="text-[9px] font-medium opacity-80">match</span>
      </div>

      {/* Company info */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 text-base font-bold text-gray-600 ring-1 ring-gray-200/50">
          {avatarLetter}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{job.companyName}</p>
          <p className="text-xs text-gray-500">{job.sourceLabel}</p>
        </div>
      </div>

      {/* Job title */}
      <h3 className="mt-5 text-lg font-semibold text-gray-900">{job.title}</h3>

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap gap-2">
        {job.employmentTypeLabel ? (
          <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
            {job.employmentTypeLabel}
          </span>
        ) : null}
        {job.regionLabel ? (
          <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
            {job.regionLabel}
          </span>
        ) : null}
        {job.companySizeLabel ? (
          <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-100">
            {job.companySizeLabel}
            {job.companySizeInferred ? (
              <span className="ml-1 text-[10px] opacity-60">(추정)</span>
            ) : null}
          </span>
        ) : null}
      </div>

      {/* Match reasons */}
      <div className="mt-4 flex-1">
        <ReasonList reasons={job.reasons} maxVisible={MAX_VISIBLE_REASONS} />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
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
              "text-xs font-medium",
              dday.urgent ? "text-red-600" : "text-gray-500"
            )}
          >
            {dday.label}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
