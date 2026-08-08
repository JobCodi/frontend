import type { z } from "zod";
import { apiUrl } from "@/lib/config/env";
import { ApiErrorBodySchema } from "@/lib/schemas/error";

/**
 * Normalized API error. Components branch on `code`, never on message text
 * or status alone (see data-flow.md §6 / §8).
 */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface ApiFetchOptions<T> {
  method?: HttpMethod;
  body?: unknown;
  schema: z.ZodType<T>;
  /** Additional request headers, such as an authenticated bearer session. */
  headers?: HeadersInit;
  /** Forwarded to fetch() for Server Component data caching (revalidate, tags). */
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
  signal?: AbortSignal;
}

const UNKNOWN_ERROR_MESSAGE = "알 수 없는 오류가 발생했어요.";
const NETWORK_ERROR_CODE = "NETWORK_ERROR";
const INVALID_RESPONSE_CODE = "INVALID_RESPONSE_SHAPE";

const BROWSER_TOKEN_KEY = "jobcodi_token";

function browserAuthorizationHeader(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = window.sessionStorage.getItem(BROWSER_TOKEN_KEY);
  return token === null ? {} : { Authorization: `Bearer ${token}` };
}

async function parseErrorBody(res: Response): Promise<{ code: string; message: string }> {
  try {
    const json: unknown = await res.json();
    const parsed = ApiErrorBodySchema.safeParse(json);
    if (parsed.success) {
      return parsed.data.error;
    }
  } catch {
    // response wasn't JSON (proxy error page, empty body, ...)
  }
  return { code: `HTTP_${res.status}`, message: UNKNOWN_ERROR_MESSAGE };
}

/**
 * Retry policy (Rules.md §3 / data-flow.md §6): GET retries up to 2 extra
 * times on network failure or 5xx. POST/PATCH/DELETE never retry — retrying
 * a session-create or turn-submit would duplicate server-side effects.
 */
function maxAttemptsFor(method: HttpMethod): number {
  return method === "GET" ? 3 : 1;
}

/**
 * Fetches `${API_BASE_URL}/api/v1${path}`, validates the JSON body against
 * `schema`, and throws `ApiError` for non-2xx responses or schema mismatches.
 * Works from both Server Components (pass `next`/`cache`) and the browser.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions<T>,
): Promise<T> {
  const method = options.method ?? "GET";
  const maxAttempts = maxAttemptsFor(method);
  const url = apiUrl(path);
  const hasBody = options.body !== undefined;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...(hasBody ? { "Content-Type": "application/json" } : {}),
          ...browserAuthorizationHeader(),
          ...options.headers,
        },
        body: hasBody ? JSON.stringify(options.body) : undefined,
        cache: options.cache,
        next: options.next,
        signal: options.signal,
      });

      if (!res.ok) {
        const { code, message } = await parseErrorBody(res);
        throw new ApiError(code, res.status, message);
      }

      if (res.status === 204) {
        return options.schema.parse(undefined);
      }

      const json: unknown = await res.json();
      const parsed = options.schema.safeParse(json);
      if (!parsed.success) {
        throw new ApiError(
          INVALID_RESPONSE_CODE,
          res.status,
          `${path} 응답이 예상한 형태와 달라요: ${parsed.error.message}`,
        );
      }
      return parsed.data;
    } catch (err) {
      lastError = err;

      const isRetryable =
        method === "GET" &&
        attempt < maxAttempts - 1 &&
        (!(err instanceof ApiError) || err.status >= 500);

      if (!isRetryable) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(
          NETWORK_ERROR_CODE,
          0,
          err instanceof Error ? err.message : UNKNOWN_ERROR_MESSAGE,
        );
      }
    }
  }

  if (lastError instanceof ApiError) throw lastError;
  throw new ApiError(NETWORK_ERROR_CODE, 0, UNKNOWN_ERROR_MESSAGE);
}

export function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: Pick<ApiFetchOptions<T>, "next" | "cache" | "signal">,
): Promise<T> {
  return apiFetch(path, { method: "GET", schema, ...init });
}

export function apiPost<T>(
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
  init?: Pick<ApiFetchOptions<T>, "signal">,
): Promise<T> {
  return apiFetch(path, { method: "POST", schema, body, ...init });
}

export function apiPatch<T>(
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
  init?: Pick<ApiFetchOptions<T>, "signal">,
): Promise<T> {
  return apiFetch(path, { method: "PATCH", schema, body, ...init });
}
