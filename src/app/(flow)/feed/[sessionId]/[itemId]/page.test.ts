import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

describe("공고 상세 직접 진입 인증 경계", () => {
  it("Server Component에서 보호된 Feed API를 호출하지 않는다", () => {
    expect(source).not.toContain("apiGet(");
    expect(source).not.toContain("generateMetadata");
  });

  it("브라우저 인증 토큰을 사용하는 클라이언트 상세 경계를 렌더한다", () => {
    expect(source).toContain("JobDetailPageClient");
  });
});
