"use client";

import { MIN_SCORE_OPTIONS, SORT_OPTIONS } from "../types";
import type { FeedQueryParams, FeedSort, MinScore } from "@/lib/schemas/feed";

interface SortFilterBarProps {
  params: FeedQueryParams;
  onChange: (next: Partial<FeedQueryParams>) => void;
  total?: number;
}

/**
 * Sort/minScore always trigger a server re-fetch via the URL — never a
 * client-side re-filter of already-loaded items (screens.md /feed
 * "클라이언트 필터링을 하지 않는다").
 */
export function SortFilterBar({ params, onChange, total }: SortFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[var(--text-muted)]">
        {total !== undefined ? `${total.toLocaleString("ko-KR")}건` : ""}
      </p>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="feed-sort">
          정렬
        </label>
        <select
          id="feed-sort"
          value={params.sort}
          onChange={(e) => onChange({ sort: e.target.value as FeedSort })}
          className="h-9 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="feed-min-score">
          최소 점수
        </label>
        <select
          id="feed-min-score"
          value={params.minScore}
          onChange={(e) => onChange({ minScore: Number(e.target.value) as MinScore })}
          className="h-9 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          {MIN_SCORE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
