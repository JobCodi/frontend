"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { cn } from "@/lib/utils/cn";
import { formatDday, formatRelativeTime } from "@/lib/utils/date";
import { ExternalLink, Bookmark, X } from "lucide-react";
import { apiPut } from "@/lib/api/client";
import type { JobView } from "../lib/to-job-view";
import { ReasonList } from "./reason-list";

interface JobCardProps {
  job: JobView;
  sessionId: string;
}

const MAX_VISIBLE_REASONS = 3;

export function JobCard({ job, sessionId }: JobCardProps) {
  const queryClient = useQueryClient();
  const updatePreference = useMutation({
    mutationFn: (preference: "saved" | "excluded" | "none") =>
      apiPut(
        `/jobs/${job.postingId}/preference`,
        z.object({ jobId: z.string(), preference: z.enum(["saved", "excluded", "none"]) }),
        { preference },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed", sessionId] }),
  });
  const dday = formatDday(job.closesAt, job.isRolling);
  const postedLabel = formatRelativeTime(job.postedAt);
  const avatarLetter = job.companyName.charAt(0).toUpperCase();
  const scoreTone =
    job.score >= 85
      ? "from-[var(--brand)] to-[#7c3aed]"
      : job.score >= 70
        ? "from-[#6366f1] to-[#8b5cf6]"
        : "from-[var(--text-muted)] to-[var(--text-subtle)]";

  return (
    <Link
      href={`/feed/${sessionId}/${job.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)]/80 bg-white shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)]/30 hover:shadow-[var(--shadow-elevated)]"
    >
      {/* Top accent line on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--brand)] to-[#7c3aed] opacity-0 transition-opacity group-hover:opacity-100"
      />

      {/* Header: Company + Score */}
      <div className="flex items-start justify-between gap-3 p-5 pb-0">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--surface-soft)] to-white text-sm font-bold text-[var(--text)] ring-1 ring-[var(--line)]">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="ui-card-title">{job.companyName}</p>
            <p className="truncate text-xs text-[var(--text-subtle)]">{job.sourceLabel}</p>
          </div>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
            scoreTone,
          )}
        >
          <strong className="text-sm font-bold leading-none">{job.score}</strong>
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider opacity-80">
            점
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="px-5 pt-4">
        <h3 className="ui-card-title transition-colors group-hover:text-[var(--brand)]">
          {job.title}
        </h3>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-5 pt-3">
        {job.employmentTypeLabel ? (
          <span className="rounded-md bg-[var(--surface-soft)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]">
            {job.employmentTypeLabel}
          </span>
        ) : null}
        {job.regionLabel ? (
          <span className="rounded-md bg-[var(--surface-soft)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]">
            {job.regionLabel}
          </span>
        ) : null}
        {job.companySizeLabel ? (
          <span className="rounded-md bg-[var(--surface-soft)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]">
            {job.companySizeLabel}
            {job.companySizeInferred ? (
              <span className="ml-0.5 text-[10px] opacity-60">(추정)</span>
            ) : null}
          </span>
        ) : null}
      </div>

      {/* Reasons */}
      <div className="flex-1 px-5 pt-4">
        <ReasonList reasons={job.reasons} maxVisible={MAX_VISIBLE_REASONS} />
      </div>

      {/* Footer */}
      <div className="mx-5 mt-4 flex items-center justify-between border-t border-[var(--line)]/80 py-3">
        <div className="flex items-center gap-2 text-xs text-[var(--text-subtle)]">
          <span>{postedLabel}</span>
          {job.alsoFoundOnLabels.length > 0 ? (
            <>
              <span className="text-[var(--line)]">|</span>
              <span>{job.alsoFoundOnLabels.length}개 출처</span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={job.preference === "saved" ? "관심 공고 해제" : "관심 공고로 저장"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              updatePreference.mutate(job.preference === "saved" ? "none" : "saved");
            }}
            className={cn("rounded-lg p-1.5 transition-colors", job.preference === "saved" ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-subtle)] hover:bg-[var(--surface-soft)]")}
          >
            <Bookmark className="h-4 w-4" fill={job.preference === "saved" ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            aria-label="이 공고 제외"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              updatePreference.mutate("excluded");
            }}
            className="rounded-lg p-1.5 text-[var(--text-subtle)] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {dday ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                dday.urgent
                  ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                  : "bg-[var(--surface-soft)] text-[var(--text-muted)]",
              )}
            >
              {dday.label}
            </span>
          ) : null}
          <ExternalLink className="h-3.5 w-3.5 text-[var(--text-subtle)] opacity-0 transition-opacity group-hover:opacity-60" />
        </div>
      </div>
    </Link>
  );
}
