import type { z } from "zod";
import { apiUrl } from "@/lib/config/env";
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  setAccessToken,
} from "@/lib/auth/access-token";
import { AuthResponseSchema } from "@/lib/schemas/auth";
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

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

const AUTH_ADAPTER_PATHS = new Set(["/auth/login", "/auth/register", "/auth/logout", "/auth/refresh"]);
const ADMIN_AUTH_PATH_PREFIX = "/admin/auth/";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function requestUrl(path: string): string {
  if (isBrowser() && AUTH_ADAPTER_PATHS.has(path)) return `/api${path}`;
  return apiUrl(path);
}

function isAdminAuthenticationPath(path: string): boolean {
  return path.startsWith(ADMIN_AUTH_PATH_PREFIX);
}

function waitForRefreshForCaller(signal?: AbortSignal): Promise<string> {
  if (signal?.aborted) return Promise.reject(signal.reason);

  const refresh = refreshAccessToken();
  if (signal === undefined) return refresh;

  return new Promise<string>((resolve, reject) => {
    const removeAbortListener = () => signal.removeEventListener("abort", onAbort);
    const onAbort = () => {
      removeAbortListener();
      reject(signal.reason);
    };
    signal.addEventListener("abort", onAbort, { once: true });

    refresh.then(
      (accessToken) => {
        removeAbortListener();
        resolve(accessToken);
      },
      (error: unknown) => {
        removeAbortListener();
        reject(error);
      },
    );
  });
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise === null) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("인증 갱신에 실패했습니다.");
        const payload = AuthResponseSchema.safeParse(await response.json());
        if (!payload.success) {
          throw new ApiError(
            INVALID_RESPONSE_CODE,
            response.status,
            `인증 갱신 응답이 예상한 형태와 달라요: ${payload.error.message}`,
          );
        }
        setAccessToken(payload.data.accessToken, payload.data.expiresAt);
        return payload.data.accessToken;
      })
      .catch((error: unknown) => {
        clearAccessToken();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function parseErrorBody(res: Response): Promise<{ code: string; message: string }> {
  try {
    const json: unknown = await res.json();
    const parsed = ApiErrorBodySchema.safeParse(json);
    if (parsed.success) {
      const { code, message, details } = parsed.data.error;
      return { code, message: details?.[0]?.message ?? message };
    }
  } catch {
    // response wasn't JSON (gateway error page, empty body, ...)
  }
  return { code: `HTTP_${res.status}`, message: UNKNOWN_ERROR_MESSAGE };
}

/**
 * Retry policy (Rules.md §3 / data-flow.md §6): GET retries up to 2 extra
 * times on network failure or 5xx. POST/PUT/PATCH/DELETE never retry — retrying
 * a session-create or turn-submit would duplicate server-side effects. A
 * GET authentication recovery is a separate, single retry; state-changing
 * methods are never replayed because they may have completed before a 401.
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
  const normalMaxAttempts = maxAttemptsFor(method);
  const maxAttempts = normalMaxAttempts + 1;
  const url = requestUrl(path);
  const hasBody = options.body !== undefined;
  const isAdapterRequest = isBrowser() && AUTH_ADAPTER_PATHS.has(path);
  const hasExplicitAuthorization = new Headers(options.headers).has("Authorization");
  const canRefresh =
    method === "GET" && isBrowser() && !isAdapterRequest && !hasExplicitAuthorization;
  const shouldRefreshBeforeMutation =
    method !== "GET" &&
    isBrowser() &&
    !isAdapterRequest &&
    !isAdminAuthenticationPath(path) &&
    !hasExplicitAuthorization &&
    (getAccessToken() === null || isAccessTokenExpired());

  if (shouldRefreshBeforeMutation) {
    await waitForRefreshForCaller(options.signal);
  }

  let lastError: unknown;
  let refreshed = false;
  let networkRetryCount = 0;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...(hasBody ? { "Content-Type": "application/json" } : {}),
          ...(isBrowser() && !isAdapterRequest && getAccessToken()
            ? { Authorization: `Bearer ${getAccessToken()}` }
            : {}),
          ...options.headers,
        },
        body: hasBody ? JSON.stringify(options.body) : undefined,
        cache: options.cache,
        next: options.next,
        signal: options.signal,
        credentials: isAdapterRequest ? "same-origin" : "omit",
      });

      if (!res.ok) {
        if (res.status === 401 && canRefresh && !refreshed) {
          refreshed = true;
          await refreshAccessToken();
          continue;
        }
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
        networkRetryCount < normalMaxAttempts - 1 &&
        (!(err instanceof ApiError) || err.status >= 500);

      if (!isRetryable) {
        if (err instanceof ApiError) throw err;
        throw new ApiError(
          NETWORK_ERROR_CODE,
          0,
          err instanceof Error ? err.message : UNKNOWN_ERROR_MESSAGE,
        );
      }

      networkRetryCount += 1;
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

export function apiPut<T>(
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
  init?: Pick<ApiFetchOptions<T>, "signal">,
): Promise<T> {
  return apiFetch(path, { method: "PUT", schema, body, ...init });
}

export function apiPatch<T>(
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
  init?: Pick<ApiFetchOptions<T>, "signal">,
): Promise<T> {
  return apiFetch(path, { method: "PATCH", schema, body, ...init });
}
