import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  it("세션 쿠키를 만료한 204를 반환한다", async () => {
    const response = await POST();

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toContain("jobcodi_session=");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
