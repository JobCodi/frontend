import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("대화 직접 진입 인증 경계", () => {
  it("Server Component에서 보호된 discovery API를 호출하지 않는다", () => {
    expect(source).not.toContain("/sessions/${sessionId}");
  });

  it("브라우저 인증 상태를 확인하는 클라이언트 경계를 렌더한다", () => {
    expect(source).toContain("DiscoveryPageClient");
  });
});
