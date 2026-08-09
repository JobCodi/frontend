import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { CriteriaComparisonResponseSchema } from "@/lib/schemas/criteria-comparison";

export function useCriteriaComparison(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.criteriaComparison(),
    queryFn: () => apiGet("/profiles/active/criteria-comparison", CriteriaComparisonResponseSchema),
    enabled,
  });
}
