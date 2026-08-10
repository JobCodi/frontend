"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Database } from "lucide-react";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import { cn } from "@/lib/utils/cn";
import { getIngestionSummary } from "../lib/ingestion-transparency";
import { SourceSummaryList } from "./source-summary-list";

interface IngestionTransparencyCardProps {
  generatedAt: string;
  sourceSummary: SourceSummaryEntry[];
}

const DETAILS_ID = "feed-source-summary";

export function IngestionTransparencyCard({
  generatedAt,
  sourceSummary,
}: IngestionTransparencyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const summary = getIngestionSummary(generatedAt, sourceSummary.length);

  if (sourceSummary.length === 0) {
    return (
      <aside className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/60 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--text-muted)] shadow-sm">
            <Database aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">수집 출처 정보가 없어요</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              마지막 Feed 업데이트 {summary.updatedAt}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/60">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={DETAILS_ID}
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)] sm:px-5"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--brand)] shadow-sm">
          <Database aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-[var(--text)]">수집 출처 확인</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
              마지막 Feed 업데이트 {summary.updatedAt}
            </span>
            <span aria-hidden="true">·</span>
            <span>{summary.sourceCount}</span>
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 text-[var(--text-subtle)] transition-transform", expanded && "rotate-180")}
        />
      </button>
      <div id={DETAILS_ID} hidden={!expanded} className="border-t border-[var(--line)] px-4 py-4 sm:px-5">
        <SourceSummaryList sourceSummary={sourceSummary} />
      </div>
    </aside>
  );
}
