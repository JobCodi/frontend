import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPut } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { ApplicationUpdateSchema, JobApplicationListSchema, JobApplicationSchema, type ApplicationUpdate } from "@/lib/schemas/application";

export function useApplications(enabled = true) {
  return useQuery({
    queryKey: queryKeys.applications(),
    queryFn: () => apiGet("/applications", JobApplicationListSchema),
    enabled,
  });
}

export function useAddJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => apiPut(`/jobs/${jobId}/application`, JobApplicationSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications() }),
  });
}

export function useUpdateJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: ApplicationUpdate }) =>
      apiPatch(`/applications/${id}`, JobApplicationSchema, ApplicationUpdateSchema.parse(update)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.applications() }),
  });
}
