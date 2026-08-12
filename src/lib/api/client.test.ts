import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError, apiFetch } from "./client";
import { clearAccessToken, setAccessToken } from "@/lib/auth/access-token";

describe("브라우저 API 인증", () => {
  afterEach(() => {
    clearAccessToken();
    vi.unstubAllGlobals();
  });

  it("access token은 메모리 Authorization에만 사용하고 직접 백엔드 호출에는 쿠키를 보내지 않는다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("window", {});
    vi.stubGlobal("fetch", fetchMock);
    setAccessToken("memory-only-access-token", "2099-01-01T00:00:00.000Z");

    await apiFetch("/profiles/active", { schema: z.object({ ok: z.boolean() }) });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/profiles/active",
      expect.objectContaining({ credentials: "omit" }),
    );
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get("authorization")).toBe(
      "Bearer memory-only-access-token",
    );
  });

  it("GET 401은 refresh 후 원 요청을 한 번만 재시도한다", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ accessToken: "rotated-access", expiresAt: "2026-12-31T00:00:00.000Z", user: { id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73", email: "user@example.com", displayName: "사용자" } }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    setAccessToken("valid-access", "2099-01-01T00:00:00.000Z");

    await expect(apiFetch("/profiles/active", {
      schema: z.object({ ok: z.boolean() }),
    })).resolves.toEqual({ ok: true });

    const profileCalls = fetchMock.mock.calls.filter(
      ([url]) => url === "http://localhost:4000/api/v1/profiles/active",
    );
    expect(profileCalls).toHaveLength(2);
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/auth/refresh")).toHaveLength(1);
    expect(new Headers(profileCalls[1]?.[1]?.headers).get("authorization")).toBe("Bearer rotated-access");
  });

  it("동시 401은 단일 refresh 후 각 원 요청을 정확히 한 번만 재시도한다", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ accessToken: "rotated-access", expiresAt: "2026-12-31T00:00:00.000Z", user: { id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73", email: "user@example.com", displayName: "사용자" } }))
      .mockResolvedValueOnce(Response.json({ ok: true }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    setAccessToken("valid-access", "2099-01-01T00:00:00.000Z");

    await Promise.all([
      apiFetch("/profiles/active", { schema: z.object({ ok: z.boolean() }) }),
      apiFetch("/applications", { schema: z.object({ ok: z.boolean() }) }),
    ]);

    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/auth/refresh")).toHaveLength(1);
    expect(fetchMock.mock.calls.filter(([url]) => url === "http://localhost:4000/api/v1/profiles/active")).toHaveLength(2);
    expect(fetchMock.mock.calls.filter(([url]) => url === "http://localhost:4000/api/v1/applications")).toHaveLength(2);
    expect(new Headers(fetchMock.mock.calls[3]?.[1]?.headers).get("authorization")).toBe("Bearer rotated-access");
  });

  it("POST 401은 refresh나 재실행 없이 원래 오류를 전달한다", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);
    setAccessToken("valid-access", "2099-01-01T00:00:00.000Z");

    await expect(apiFetch("/sessions", {
      method: "POST",
      body: { goal: "backend" },
      schema: z.object({ ok: z.boolean() }),
    })).rejects.toMatchObject({
      code: "HTTP_401",
      status: 401,
    });

    const sessionCalls = fetchMock.mock.calls.filter(
      ([url]) => url === "http://localhost:4000/api/v1/sessions",
    );
    expect(sessionCalls).toHaveLength(1);
    expect(sessionCalls.map(([, init]) => ({ method: init?.method, body: init?.body }))).toEqual([
      { method: "POST", body: JSON.stringify({ goal: "backend" }) },
    ]);
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/auth/refresh")).toHaveLength(0);
  });

  it("만료된 메모리 token의 POST는 갱신 뒤 회전된 bearer로 정확히 한 번만 전송한다", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({
        accessToken: "rotated-access",
        expiresAt: "2099-01-01T00:00:00.000Z",
        user: { id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73", email: "user@example.com", displayName: "사용자" },
      }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    setAccessToken("expired-access", "1970-01-01T00:00:00.000Z");

    await expect(apiFetch("/sessions", {
      method: "POST",
      body: { goal: "backend" },
      schema: z.object({ ok: z.boolean() }),
    })).resolves.toEqual({ ok: true });

    const sessionCalls = fetchMock.mock.calls.filter(
      ([url]) => url === "http://localhost:4000/api/v1/sessions",
    );
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/auth/refresh")).toHaveLength(1);
    expect(sessionCalls).toHaveLength(1);
    expect(new Headers(sessionCalls[0]?.[1]?.headers).get("authorization")).toBe("Bearer rotated-access");
  });

  it("refresh의 200 응답이 AuthResponseSchema를 만족하지 않으면 형태 오류를 전달한다", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ accessToken: "rotated-access" }));
    vi.stubGlobal("fetch", fetchMock);
    setAccessToken("expired-access", "1970-01-01T00:00:00.000Z");

    await expect(apiFetch("/profiles/active", {
      schema: z.object({ ok: z.boolean() }),
    })).rejects.toMatchObject({
      code: "INVALID_RESPONSE_SHAPE",
      status: 200,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("refresh endpoint의 401은 다시 refresh하거나 재시도하지 않는다", async () => {
    vi.stubGlobal("window", {});
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/auth/refresh", { method: "POST", schema: z.undefined() })).rejects.toBeInstanceOf(ApiError);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", expect.objectContaining({
      credentials: "same-origin",
    }));
  });
});
