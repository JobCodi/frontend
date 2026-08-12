import { describe, expect, it, vi } from "vitest";
import { bootstrapAuthSession } from "./auth-bootstrap";

const user = {
  id: "63a24bd1-98fb-4d8b-9aeb-dde3cb4cda73",
  email: "user@example.com",
  displayName: "사용자",
};

describe("인증 부트스트랩", () => {
  it("refresh 응답의 user로 인증 상태를 초기화한다", async () => {
    const refresh = vi.fn().mockResolvedValue({
      accessToken: "memory-only-access",
      expiresAt: "2026-12-31T00:00:00.000Z",
      user,
    });

    await expect(bootstrapAuthSession(refresh)).resolves.toEqual({
      status: "authenticated",
      session: {
        accessToken: "memory-only-access",
        expiresAt: "2026-12-31T00:00:00.000Z",
        user,
      },
    });
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("refresh 실패는 안전하게 미인증 초기화로 결정한다", async () => {
    const refresh = vi.fn().mockRejectedValue(new Error("network unavailable"));

    await expect(bootstrapAuthSession(refresh)).resolves.toEqual({
      status: "unauthenticated",
    });
  });
});
