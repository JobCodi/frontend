import { apiFetch, apiPost } from "@/lib/api/client";
import {
  AdminMeResponseSchema,
  AdminSessionSchema,
  CrawlPluginsResponseSchema,
  CrawlSiteSchema,
  CrawlSitesResponseSchema,
  ManualRunResponseSchema,
  type GenericStaticListConfig,
} from "@/lib/schemas/admin";
import { IngestionSourcesResponseSchema } from "@/lib/schemas/ingestion";

const adminAuthorization = (accessToken: string): HeadersInit => ({
  Authorization: `Bearer ${accessToken}`,
});

export function loginAdmin(email: string, password: string) {
  return apiPost("/admin/auth/login", AdminSessionSchema, { email, password }, { useBff: false });
}

export function getAdminMe(accessToken: string) {
  return apiFetch("/admin/auth/me", {
    schema: AdminMeResponseSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}

export function getAdminSources(accessToken: string) {
  return apiFetch("/ingestion/sources", {
    schema: IngestionSourcesResponseSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}

export function getCrawlPlugins(accessToken: string) {
  return apiFetch("/ingestion/plugins", {
    schema: CrawlPluginsResponseSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}

export function getCrawlSites(accessToken: string) {
  return apiFetch("/ingestion/crawl-sites", {
    schema: CrawlSitesResponseSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}

export interface CreateCrawlSitePayload {
  displayName: string;
  termsUrl: string;
  entryUrls: string[];
  minIntervalMs: number;
  pluginId: "generic-static-list";
  pluginConfig: GenericStaticListConfig;
}

export function createCrawlSite(accessToken: string, payload: CreateCrawlSitePayload) {
  return apiFetch("/ingestion/crawl-sites", {
    method: "POST",
    body: payload,
    schema: CrawlSiteSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}

export function updateCrawlSiteStatus(
  accessToken: string,
  siteId: string,
  status: "pending_review" | "active" | "suspended",
) {
  return apiFetch(`/ingestion/crawl-sites/${siteId}/status`, {
    method: "PATCH",
    body: { status },
    schema: CrawlSiteSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}

export function runCrawlSite(accessToken: string, siteId: string) {
  return apiFetch(`/ingestion/crawl-sites/${siteId}/runs`, {
    method: "POST",
    body: {},
    schema: ManualRunResponseSchema,
    headers: adminAuthorization(accessToken),
    useBff: false,
  });
}
