import { afterEach, describe, expect, it, vi } from "vitest";
import { authenticatedResponse, loggedOutResponse } from "./auth";
import { forwardProxyRequest, passthroughResponse, USER_SESSION_COOKIE } from "./backend";

const backendAuthPayload = {
  accessToken: "backend-secret-token",
  expiresAt: "2026-12-31T00:00:00.000Z",
  user: { id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73", email: "user@example.com", displayName: "사용자" },
};

describe("BFF 인증 응답", () => {
  it("accessToken을 직렬화하지 않고 HttpOnly 세션 쿠키에만 저장한다", async () => {
    const response = await authenticatedResponse(Response.json(backendAuthPayload));

    expect(await response.json()).toEqual({
      expiresAt: backendAuthPayload.expiresAt,
      user: backendAuthPayload.user,
    });
    expect(response.headers.get("set-cookie")).toContain(`${USER_SESSION_COOKIE}=backend-secret-token`);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).not.toContain("accessToken");
  });

  it("백엔드 오류 envelope와 상태를 그대로 전달한다", async () => {
    const response = await authenticatedResponse(new Response(JSON.stringify({ error: { code: "INVALID_CREDENTIALS", message: "실패" } }), {
      status: 401,
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: { code: "INVALID_CREDENTIALS", message: "실패" } });
  });

  it("로그아웃은 세션 쿠키를 만료한다", () => {
    const response = loggedOutResponse();

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toContain(`${USER_SESSION_COOKIE}=`);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});

describe("BFF 프록시", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("고정 백엔드 URL로 쿼리와 본문을 전달하고 쿠키 토큰만 Authorization에 사용한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);
    const request = new Request("https://app.example/api/bff/sessions/abc?cursor=next", {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: "Bearer injected" },
      body: JSON.stringify({ name: "변경" }),
    });

    await forwardProxyRequest(request, ["sessions", "abc"], "cookie-token");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/sessions/abc?cursor=next",
      expect.objectContaining({ method: "PATCH" }),
    );
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer cookie-token");
    expect(new Headers(init.headers).get("authorization")).not.toBe("Bearer injected");
    expect(await new Response(init.body).text()).toBe('{"name":"변경"}');
  });

  it("백엔드 응답의 상태와 오류 본문을 그대로 전달한다", async () => {
    const response = await passthroughResponse(new Response(JSON.stringify({ error: { code: "FORBIDDEN", message: "권한 없음" } }), {
      status: 403,
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: { code: "FORBIDDEN", message: "권한 없음" } });
  });

  it("본문이 없는 성공 상태도 그대로 전달한다", async () => {
    const response = await passthroughResponse(new Response(null, { status: 204 }));

    expect(response.status).toBe(204);
    await expect(response.text()).resolves.toBe("");
  });
});
