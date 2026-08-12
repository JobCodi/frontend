import { describe, expect, it } from "vitest";
import { getDiscoveryAuthBoundaryState } from "./discovery-auth-boundary-state";

describe("getDiscoveryAuthBoundaryState", () => {
  it("인증 초기화 중에는 discovery 쿼리를 시작하지 않는다", () => {
    expect(getDiscoveryAuthBoundaryState({ isAuthLoading: true, hasUser: false })).toEqual({
      state: "loading",
      canQuery: false,
    });
  });

  it("초기화 후 비인증 방문자는 로그인으로 보낸다", () => {
    expect(getDiscoveryAuthBoundaryState({ isAuthLoading: false, hasUser: false })).toEqual({
      state: "redirect",
      canQuery: false,
    });
  });

  it("인증된 방문자만 discovery 쿼리를 시작한다", () => {
    expect(getDiscoveryAuthBoundaryState({ isAuthLoading: false, hasUser: true })).toEqual({
      state: "ready",
      canQuery: true,
    });
  });
});
