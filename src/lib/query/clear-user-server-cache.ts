import type { QueryClient } from "@tanstack/react-query";

export function clearUserServerCache(queryClient: QueryClient): void {
  queryClient.clear();
}
