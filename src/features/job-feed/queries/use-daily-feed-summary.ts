import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { DailyFeedSummaryResponseSchema } from "@/lib/schemas/daily-feed-summary";

export function useDailyFeedSummary(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.dailyFeedSummary(),
    queryFn: () => apiGet("/profiles/active/daily-summary", DailyFeedSummaryResponseSchema),
    enabled,
    retry: false,
  });
}
