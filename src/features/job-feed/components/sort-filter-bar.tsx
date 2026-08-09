"use client";

import { MIN_SCORE_OPTIONS, SORT_OPTIONS } from "../types";
import { Bookmark, SlidersHorizontal } from "lucide-react";
import type { FeedPreference, FeedQueryParams, FeedSort, MinScore } from "@/lib/schemas/feed";

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
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.25)]">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">
            {total !== undefined ? (
              <>
                총{" "}
                <span className="text-[var(--brand)]">{total.toLocaleString("ko-KR")}</span>
                건의 맞춤 공고
              </>
            ) : (
              "정렬 및 필터"
            )}
          </p>
          <p className="text-xs text-[var(--text-subtle)]">서버 기준으로 다시 정렬·필터합니다</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <div className="inline-flex w-fit rounded-xl bg-[var(--surface-soft)] p-1 ring-1 ring-[var(--line)]" role="group" aria-label="공고 보기">
          {([
            { value: "all", label: "전체 공고" },
            { value: "saved", label: "관심 공고" },
          ] as const).map((option) => {
            const active = params.preference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ preference: option.value as FeedPreference })}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] ${
                  active
                    ? "bg-white text-[var(--brand)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {option.value === "saved" ? <Bookmark className="h-3.5 w-3.5" /> : null}
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="feed-sort">
          정렬
        </label>
        <select
          id="feed-sort"
          value={params.sort}
          onChange={(e) => onChange({ sort: e.target.value as FeedSort })}
          className="h-10 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
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
          className="h-10 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] px-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          {MIN_SCORE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        </div>
      </div>
    </div>
  );
}
