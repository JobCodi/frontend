import { afterEach, describe, expect, it, vi } from "vitest";
import { clearAccessToken, getAccessToken } from "./access-token";
import { refresh } from "./client";

const user = {
  id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73",
  email: "user@example.com",
  displayName: "사용자",
};

describe("사용자 인증 클라이언트", () => {
  afterEach(() => {
    clearAccessToken();
    vi.unstubAllGlobals();
  });

  it("refresh는 same-origin 어댑터 응답을 반환한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      accessToken: "rotated-access",
      expiresAt: "2026-12-31T00:00:00.000Z",
      user,
    }));
    vi.stubGlobal("window", {});
    vi.stubGlobal("fetch", fetchMock);

    await expect(refresh()).resolves.toEqual({
      accessToken: "rotated-access",
      expiresAt: "2026-12-31T00:00:00.000Z",
      user,
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", expect.objectContaining({
      credentials: "same-origin",
      method: "POST",
    }));
    expect(getAccessToken()).toBeNull();
  });

  it("동시 refresh 요청은 하나의 same-origin 요청으로 합친다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      accessToken: "rotated-access",
      expiresAt: "2026-12-31T00:00:00.000Z",
      user,
    }));
    vi.stubGlobal("window", {});
    vi.stubGlobal("fetch", fetchMock);

    await expect(Promise.all([refresh(), refresh()])).resolves.toHaveLength(2);

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
