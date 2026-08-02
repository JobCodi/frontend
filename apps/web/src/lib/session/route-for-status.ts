import type { SessionStatus } from "@/lib/schemas/common";

/**
 * The ONLY place session status maps to a route (data-flow.md §5). Every
 * screen that needs to redirect based on session status must call this.
 *
 *   interviewing        -> /discovery/:id
 *   criteria_ready       -> /discovery/:id/criteria
 *   collecting | ready    -> /feed/:id
 *   collection_failed   -> /feed/:id (retry UI lives on the feed screen itself)
 *   abandoned            -> /session-expired
 */
export function routeForStatus(status: SessionStatus, sessionId: string): string {
  switch (status) {
    case "interviewing":
      return `/discovery/${sessionId}`;
    case "criteria_ready":
      return `/discovery/${sessionId}/criteria`;
    case "collecting":
    case "ready":
    case "collection_failed":
      return `/feed/${sessionId}`;
    case "abandoned":
      return "/session-expired";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
