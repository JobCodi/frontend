import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { DeadlineReminderResponseSchema } from "@/lib/schemas/application";

export function useDeadlineReminders(enabled = true) {
  return useQuery({
    queryKey: queryKeys.deadlineReminders(),
    queryFn: () => apiGet("/applications/reminders", DeadlineReminderResponseSchema),
    enabled,
  });
}
