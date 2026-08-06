"use client";

import { MIN_SCORE_OPTIONS, SORT_OPTIONS } from "../types";
import { SlidersHorizontal } from "lucide-react";
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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          {total !== undefined ? (
            <>
              총 <span className="font-bold text-indigo-600">{total.toLocaleString("ko-KR")}</span>건
            </>
          ) : (
            "정렬 및 필터"
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="feed-sort">
          정렬
        </label>
        <select
          id="feed-sort"
          value={params.sort}
          onChange={(e) => onChange({ sort: e.target.value as FeedSort })}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
