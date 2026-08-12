import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  requestBackend: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("@/lib/bff/backend", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/bff/backend")>();
  return { ...actual, requestBackend: mocks.requestBackend };
});

import { LOGOUT_BACKEND_TIMEOUT_MS } from "@/lib/bff/backend";
import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    mocks.cookies.mockResolvedValue({ get: vi.fn().mockReturnValue({ value: "refresh-token" }) });
    mocks.requestBackend.mockResolvedValue(new Response(null, { status: 204 }));
  });

  it("백엔드 로그아웃을 호출하고 refresh 쿠키를 만료한 204를 반환한다", async () => {
    const response = await POST();

    expect(response.status).toBe(204);
    expect(mocks.requestBackend).toHaveBeenCalledWith("/auth/logout", expect.objectContaining({
      body: JSON.stringify({ refreshToken: "refresh-token" }),
    }));
    expect(response.headers.get("set-cookie")).toContain("jobcodi_refresh=");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("백엔드 credential 오류여도 refresh 쿠키를 반드시 만료한다", async () => {
    mocks.requestBackend.mockResolvedValue(new Response(null, { status: 401 }));

    const response = await POST();

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("백엔드 요청 자체가 실패해도 refresh 쿠키를 반드시 만료한다", async () => {
    mocks.requestBackend.mockRejectedValue(new Error("network failure"));

    const response = await POST();

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("백엔드 요청이 시간 제한 신호에서만 거부돼도 refresh 쿠키를 만료한 204를 반환한다", async () => {
    vi.useFakeTimers();
    try {
      mocks.requestBackend.mockImplementation((_, init: RequestInit) => new Promise((_, reject) => {
        init.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
      }));

      const responsePromise = POST();
      await vi.advanceTimersByTimeAsync(LOGOUT_BACKEND_TIMEOUT_MS);
      const response = await responsePromise;

      expect(response.status).toBe(204);
      expect(mocks.requestBackend).toHaveBeenCalledWith("/auth/logout", expect.objectContaining({
        signal: expect.any(AbortSignal),
      }));
      expect(response.headers.get("set-cookie")).toContain("jobcodi_refresh=");
      expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    } finally {
      vi.useRealTimers();
    }
  });
});
