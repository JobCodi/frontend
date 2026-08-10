import { describe, expect, it } from "vitest";
import { createQueryClient } from "./client";
import { clearUserServerCache } from "./clear-user-server-cache";
import { queryKeys } from "./keys";

describe("인증 전환 사용자 서버 캐시 격리", () => {
  it("A 로그아웃 후 B 로그인 시 A의 캐시 데이터를 노출하지 않는다", () => {
    const queryClient = createQueryClient();
    const sessionId = "account-a-active-session";

    queryClient.setQueryData(queryKeys.applications(), [{ id: "account-a-application" }]);
    queryClient.setQueryData(queryKeys.activeProfile(), { id: "account-a-profile" });
    queryClient.setQueryData(queryKeys.deadlineReminders(), [{ id: "account-a-reminder" }]);
    queryClient.setQueryData(queryKeys.dailyFeedSummary(), { total: 7 });
    queryClient.setQueryData(queryKeys.criteriaComparison(), { changed: true });
    queryClient.setQueryData(queryKeys.session(sessionId), { sessionId });

    clearUserServerCache(queryClient);

    expect(queryClient.getQueryData(queryKeys.applications())).toBeUndefined();
    expect(queryClient.getQueryData(queryKeys.activeProfile())).toBeUndefined();
    expect(queryClient.getQueryData(queryKeys.deadlineReminders())).toBeUndefined();
    expect(queryClient.getQueryData(queryKeys.dailyFeedSummary())).toBeUndefined();
    expect(queryClient.getQueryData(queryKeys.criteriaComparison())).toBeUndefined();
    expect(queryClient.getQueryData(queryKeys.session(sessionId))).toBeUndefined();
  });
});
