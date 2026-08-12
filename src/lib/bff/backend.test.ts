import { describe, expect, it } from "vitest";
import { authenticatedResponse, loggedOutResponse } from "./auth";
import { passthroughResponse, REFRESH_TOKEN_COOKIE } from "./backend";

const backendAuthPayload = {
  accessToken: "backend-secret-token",
  refreshToken: "backend-refresh-token",
  expiresAt: "2026-12-31T00:00:00.000Z",
  refreshExpiresAt: "2027-01-31T00:00:00.000Z",
  user: { id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73", email: "user@example.com", displayName: "사용자" },
};

describe("BFF 인증 응답", () => {
  it("accessToken만 브라우저 JSON으로 반환하고 refreshToken은 HttpOnly 제한 쿠키에만 저장한다", async () => {
    const response = await authenticatedResponse(Response.json(backendAuthPayload));

    expect(await response.json()).toEqual({
      accessToken: backendAuthPayload.accessToken,
      expiresAt: backendAuthPayload.expiresAt,
      user: backendAuthPayload.user,
    });
    expect(response.headers.get("set-cookie")).toContain(`${REFRESH_TOKEN_COOKIE}=backend-refresh-token`);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toMatch(/(?:^|;)\s*SameSite=Lax(?:;|$)/i);
    expect(response.headers.get("set-cookie")).toContain("Path=/api/auth");
    expect(response.headers.get("set-cookie")).not.toContain("backend-secret-token");
    expect(response.headers.get("set-cookie")).not.toContain("refreshToken");
  });

  it("백엔드 오류 envelope와 상태를 그대로 전달한다", async () => {
    const response = await authenticatedResponse(new Response(JSON.stringify({ error: { code: "INVALID_CREDENTIALS", message: "실패" } }), {
      status: 401,
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: { code: "INVALID_CREDENTIALS", message: "실패" } });
  });

  it("로그아웃은 refresh 쿠키를 만료한다", () => {
    const response = loggedOutResponse();

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toContain(`${REFRESH_TOKEN_COOKIE}=`);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});

describe("백엔드 응답 전달", () => {
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
