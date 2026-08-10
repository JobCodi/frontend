import { describe, expect, it } from "vitest";
import { isCurrentAuthInitialization } from "./auth-initialization";

describe("isCurrentAuthInitialization", () => {
  it("현재 세대의 초기 인증 요청 결과만 반영한다", () => {
    expect(isCurrentAuthInitialization(3, 3)).toBe(true);
    expect(isCurrentAuthInitialization(3, 4)).toBe(false);
  });
});
