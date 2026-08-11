import { describe, expect, it } from "vitest";
import { sessionNotFoundRecovery } from "./session-not-found-recovery";

describe("sessionNotFoundRecovery", () => {
  it("만료를 단정하지 않고 원래 계정으로의 재인증 가능성을 안내한다", () => {
    expect(sessionNotFoundRecovery.description).toContain("만료되었거나");
    expect(sessionNotFoundRecovery.description).toContain("처음 사용한 계정으로 로그인");
    expect(sessionNotFoundRecovery.description).not.toContain("24시간");
  });

  it("세션 ID 없이 안전한 시작 경로로만 복구·계정 전환을 연결한다", () => {
    expect(sessionNotFoundRecovery.startHref).toBe("/start");
    expect(sessionNotFoundRecovery.switchAccountHref).toBe("/login?redirect=%2Fstart");
    expect(sessionNotFoundRecovery.switchAccountHref).not.toMatch(/session|[0-9a-f]{8}-/i);
  });
});
