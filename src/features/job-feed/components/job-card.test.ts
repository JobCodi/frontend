import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./job-card.tsx", import.meta.url), "utf8");

describe("JobCard 접근성 경계", () => {
  it("카드 전체 링크 안에 액션 버튼을 중첩하지 않는다", () => {
    expect(source).toContain("<article");
    expect(source).not.toMatch(/<Link[\s\S]*<button[\s\S]*<\/Link>/);
  });

  it("모든 아이콘 액션에 접근 가능한 이름을 제공한다", () => {
    expect(source).toContain('aria-label="지원 관리에 추가"');
    expect(source).toContain('aria-label="추천에서 제외"');
  });
});
