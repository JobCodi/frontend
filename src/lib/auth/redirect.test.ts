import { describe, expect, it } from "vitest";
import { safeAuthRedirect } from "./redirect";

describe("safeAuthRedirect", () => {
  it.each([
    ["/feed/session-1", "/feed/session-1"],
    ["//evil.example", "/start"],
    ["/\\evil.example", "/start"],
    ["https://evil.example", "/start"],
    ["javascript:alert(1)", "/start"],
    [null, "/start"],
  ])("%s를 안전한 경로로 변환한다", (value, expected) => {
    expect(safeAuthRedirect(value)).toBe(expected);
  });
});
