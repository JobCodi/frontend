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

import { POST } from "./route";

const backendAuthPayload = {
  accessToken: "new-access-token",
  refreshToken: "new-refresh-token",
  expiresAt: "2026-12-31T00:00:00.000Z",
  refreshExpiresAt: "2027-01-31T00:00:00.000Z",
  user: { id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73", email: "user@example.com", displayName: "사용자" },
};

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    mocks.cookies.mockResolvedValue({ get: vi.fn().mockReturnValue({ value: "old-refresh-token" }) });
    mocks.requestBackend.mockResolvedValue(Response.json(backendAuthPayload));
  });

  it("HttpOnly refresh 쿠키만 서버에서 전달하고 회전된 refresh token은 JSON에 노출하지 않는다", async () => {
    const response = await POST();

    expect(mocks.requestBackend).toHaveBeenCalledWith("/auth/refresh", expect.objectContaining({
      body: JSON.stringify({ refreshToken: "old-refresh-token" }),
    }));
    await expect(response.json()).resolves.toEqual({
      accessToken: "new-access-token",
      expiresAt: backendAuthPayload.expiresAt,
      user: backendAuthPayload.user,
    });
    expect(response.headers.get("set-cookie")).toContain("jobcodi_refresh=new-refresh-token");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).not.toContain("new-access-token");
  });

  it("백엔드 5xx에서는 refresh 쿠키를 유지한 정규화된 오류를 반환한다", async () => {
    mocks.requestBackend.mockResolvedValue(new Response("backend failure", { status: 503 }));

    const response = await POST();

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: { code: "AUTH_REFRESH_UNAVAILABLE", message: "인증 갱신을 일시적으로 완료하지 못했어요." },
    });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("백엔드 네트워크 예외에서는 refresh 쿠키를 유지한 정규화된 오류를 반환한다", async () => {
    mocks.requestBackend.mockRejectedValue(new Error("network failure"));

    const response = await POST();

    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("형식이 깨진 백엔드 성공 응답에서도 refresh 쿠키를 유지한다", async () => {
    mocks.requestBackend.mockResolvedValue(Response.json({ accessToken: "new-access-token" }));

    const response = await POST();

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: { code: "AUTH_REFRESH_UNAVAILABLE", message: "인증 갱신을 일시적으로 완료하지 못했어요." },
    });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("백엔드 401은 refresh 쿠키를 만료한다", async () => {
    mocks.requestBackend.mockResolvedValue(new Response(null, { status: 401 }));

    const response = await POST();

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toContain("jobcodi_refresh=");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
