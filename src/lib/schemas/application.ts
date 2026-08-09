import { z } from "zod";

export const ApplicationJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string(),
  url: z.string().url(),
  closesAt: z.string().nullable(),
  isRolling: z.boolean(),
});

export const ApplicationStatusSchema = z.enum(["reviewing", "planned", "applied", "closed"]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const JobApplicationSchema = z.object({
  id: z.string(),
  status: ApplicationStatusSchema,
  plannedAt: z.string().nullable(),
  appliedAt: z.string().nullable(),
  note: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  job: ApplicationJobSchema,
});
export type JobApplication = z.infer<typeof JobApplicationSchema>;

export const JobApplicationListSchema = z.array(JobApplicationSchema);
export const ApplicationUpdateSchema = z.object({
  status: ApplicationStatusSchema.optional(),
  plannedAt: z.string().datetime().nullable().optional(),
  appliedAt: z.string().datetime().nullable().optional(),
  note: z.string().max(1000).nullable().optional(),
});
export type ApplicationUpdate = z.infer<typeof ApplicationUpdateSchema>;
