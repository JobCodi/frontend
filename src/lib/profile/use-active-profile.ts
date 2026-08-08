"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { ActiveProfileResponseSchema } from "@/lib/schemas/profile";

export function useActiveProfile() {
  return useQuery({
    queryKey: ["active-profile"],
    queryFn: () => apiGet("/profiles/active", ActiveProfileResponseSchema),
    retry: false,
    staleTime: 30_000,
  });
}
