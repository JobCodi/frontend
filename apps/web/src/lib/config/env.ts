/**
 * Centralized environment/config access. Never read `process.env.NEXT_PUBLIC_*`
 * directly elsewhere — go through this module so defaults stay in one place.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const API_PREFIX = "/api/v1";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}
