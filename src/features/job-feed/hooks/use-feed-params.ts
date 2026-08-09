"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FeedPreferenceSchema, FeedSortSchema, MinScoreSchema, type FeedQueryParams } from "@/lib/schemas/feed";
import { DEFAULT_MIN_SCORE, DEFAULT_SORT } from "../types";

/**
 * Sort/minScore live in the URL (data-flow.md §1) so back/forward restores
 * them. Changing either goes through router.replace, which changes the
 * TanStack Query key and triggers a fresh server-side fetch — never a
 * client-side re-filter of already-loaded items.
 */
export function useFeedParams(): {
  params: FeedQueryParams;
  setParams: (next: Partial<FeedQueryParams>) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo<FeedQueryParams>(() => {
    const sortRaw = searchParams.get("sort");
    const minScoreRaw = searchParams.get("minScore");
    const preferenceRaw = searchParams.get("preference");
    const sortParsed = FeedSortSchema.safeParse(sortRaw);
    const minScoreParsed = MinScoreSchema.safeParse(
      minScoreRaw !== null ? Number(minScoreRaw) : undefined,
    );
    const preferenceParsed = FeedPreferenceSchema.safeParse(preferenceRaw);
    return {
      sort: sortParsed.success ? sortParsed.data : DEFAULT_SORT,
      minScore: minScoreParsed.success ? minScoreParsed.data : DEFAULT_MIN_SCORE,
      preference: preferenceParsed.success ? preferenceParsed.data : "all",
    };
  }, [searchParams]);

  const setParams = useCallback(
    (next: Partial<FeedQueryParams>) => {
      const merged = { ...params, ...next };
      const query = new URLSearchParams();
      query.set("sort", merged.sort);
      query.set("minScore", String(merged.minScore));
      query.set("preference", merged.preference);
      router.replace(`${pathname}?${query.toString()}`);
    },
    [params, pathname, router],
  );

  return { params, setParams };
}
