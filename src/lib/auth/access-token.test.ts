import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  setAccessToken,
} from "./access-token";

describe("access token 메모리 저장소", () => {
  afterEach(() => {
    clearAccessToken();
    vi.unstubAllGlobals();
  });

  it("access token은 모듈 메모리에서만 읽고 지운다", () => {
    vi.stubGlobal("localStorage", { setItem: vi.fn(() => { throw new Error("persistent storage 사용 금지"); }) });
    vi.stubGlobal("sessionStorage", { setItem: vi.fn(() => { throw new Error("persistent storage 사용 금지"); }) });
    vi.stubGlobal("indexedDB", { open: vi.fn(() => { throw new Error("persistent storage 사용 금지"); }) });

    setAccessToken("access-in-memory-only", "2099-01-01T00:00:00.000Z");
    expect(getAccessToken()).toBe("access-in-memory-only");

    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("잘못된 expiresAt은 예외 없이 만료된 token으로 취급한다", () => {
    setAccessToken("access-in-memory-only", "not-a-date");

    expect(isAccessTokenExpired()).toBe(true);
  });
});
