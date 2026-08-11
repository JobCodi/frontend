import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("/api/bff/[...path]", () => {
  it("accessToken을 노출할 수 있는 백엔드 auth 엔드포인트 프록시를 막는다", async () => {
    const response = await POST(new Request("https://app.example/api/bff/auth/login", { method: "POST" }), {
      params: Promise.resolve({ path: ["auth", "login"] }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: { code: "NOT_FOUND", message: "찾을 수 없어요." } });
  });
});
