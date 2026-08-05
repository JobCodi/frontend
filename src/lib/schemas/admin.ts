import { z } from "zod";

export const AdminSchema = z.object({
  email: z.email(),
});

export const AdminSessionSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.string().min(1),
  admin: AdminSchema,
});
export type AdminSession = z.infer<typeof AdminSessionSchema>;

export const AdminMeResponseSchema = z.object({
  admin: AdminSchema,
});
export type AdminMeResponse = z.infer<typeof AdminMeResponseSchema>;

export const CrawlPluginSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
});
export type CrawlPlugin = z.infer<typeof CrawlPluginSchema>;

export const CrawlPluginsResponseSchema = z.object({
  plugins: z.array(CrawlPluginSchema),
});

export const CrawlSiteStatusSchema = z.enum(["draft", "pending_review", "active", "suspended"]);
export type CrawlSiteStatus = z.infer<typeof CrawlSiteStatusSchema>;

export const CrawlSiteSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  displayName: z.string().min(1),
  pluginId: z.string().min(1),
  pluginConfig: z.record(z.string(), z.unknown()),
  termsUrl: z.string().url(),
  entryUrls: z.array(z.string().url()).default([]),
  status: CrawlSiteStatusSchema,
  minIntervalMs: z.number().int().min(0),
  approvedAt: z.string().nullable(),
  approvedBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type CrawlSite = z.infer<typeof CrawlSiteSchema>;

export const CrawlSitesResponseSchema = z.object({
  crawlSites: z.array(CrawlSiteSchema),
});

export const ManualRunResponseSchema = z.object({
  status: z.string().min(1),
});

export const GenericStaticListConfigSchema = z.object({
  itemSelector: z.string().trim().min(1).max(300),
  titleSelector: z.string().trim().min(1).max(300),
  linkSelector: z.string().trim().min(1).max(300),
  companySelector: z.string().trim().min(1).max(300),
  regionSelector: z.string().trim().min(1).max(300).optional(),
  employmentTypeSelector: z.string().trim().min(1).max(300).optional(),
  experienceSelector: z.string().trim().min(1).max(300).optional(),
  postedAtSelector: z.string().trim().min(1).max(300).optional(),
  closesAtSelector: z.string().trim().min(1).max(300).optional(),
  maxItems: z.number().int().min(1).max(100).optional(),
});
export type GenericStaticListConfig = z.infer<typeof GenericStaticListConfigSchema>;
