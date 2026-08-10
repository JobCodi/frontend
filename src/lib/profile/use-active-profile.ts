"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { ActiveProfileResponseSchema } from "@/lib/schemas/profile";

export function useActiveProfile() {
  return useQuery({
    queryKey: queryKeys.activeProfile(),
    queryFn: () => apiGet("/profiles/active", ActiveProfileResponseSchema),
    retry: false,
    staleTime: 30_000,
  });
}
