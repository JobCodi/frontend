import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SubmitTurnRequest } from "@/lib/schemas/session";

const state = vi.hoisted(() => {
  const cache = new Map<string, unknown>();

  return {
    apiPost: vi.fn(),
    cache,
    mutationOptions: undefined as unknown,
    router: { push: vi.fn(), replace: vi.fn() },
  };
});

vi.mock("next/navigation", () => ({ useRouter: () => state.router }));

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options: unknown) => {
    state.mutationOptions = options;
    return options;
  },
  useQueryClient: () => ({
    cancelQueries: vi.fn().mockResolvedValue(undefined),
    getQueryData: <T>(key: readonly string[]) => state.cache.get(JSON.stringify(key)) as T | undefined,
    invalidateQueries: vi.fn().mockResolvedValue(undefined),
    setQueryData: (key: readonly string[], value: unknown) => {
      const cacheKey = JSON.stringify(key);
      const old = state.cache.get(cacheKey);
      state.cache.set(cacheKey, typeof value === "function" ? value(old) : value);
    },
  }),
}));

vi.mock("@/lib/api/client", () => ({
  ApiError: class ApiError extends Error {},
  apiPost: state.apiPost,
}));

vi.mock("./use-pending-turn", () => ({
  setPendingTurn: (_queryClient: unknown, sessionId: string, turn: unknown) => {
    state.cache.set(JSON.stringify(["pending-turn", sessionId]), turn);
  },
}));

interface SubmitTurnMutationOptions {
  mutationFn: (vars: SubmitTurnRequest) => Promise<unknown>;
  onMutate: (vars: SubmitTurnRequest) => Promise<unknown>;
}

describe("Discovery 답변 turnIndex", () => {
  beforeEach(() => {
    state.apiPost.mockReset().mockResolvedValue({ status: "interviewing" });
    state.cache.clear();
    state.mutationOptions = undefined;
    state.router.push.mockReset();
    state.router.replace.mockReset();
  });

  it("낙관적 캐시 갱신 뒤에도 UI가 전달한 turnIndex로 선택지를 제출한다", async () => {
    const sessionId = "session-1";
    state.cache.set(JSON.stringify(["pending-turn", sessionId]), {
      index: 1,
      slot: "role",
      question: "어떤 직무를 원하시나요?",
      choices: [{ value: "BACKEND", label: "백엔드" }],
      allowsFreeText: false,
    });
    state.cache.set(JSON.stringify(["session", sessionId]), {
      sessionId,
      status: "interviewing",
      goalInput: { companySizes: [], jobFamily: "개발", roles: [], experienceLevel: "신입", regions: [], employmentTypes: [] },
      turnIndex: 0,
      remainingTurns: 5,
      filledSlots: [],
      turns: [],
      expiresAt: "2026-12-31T00:00:00.000Z",
    });

    const { useSubmitTurn } = await import("./use-submit-turn");
    useSubmitTurn(sessionId);
    const options = state.mutationOptions as SubmitTurnMutationOptions;
    const vars = { turnIndex: 1, choiceValue: "BACKEND" };

    await options.onMutate(vars);
    await options.mutationFn(vars);

    expect(state.cache.get(JSON.stringify(["pending-turn", sessionId]))).toBeNull();
    expect(state.cache.get(JSON.stringify(["session", sessionId]))).toMatchObject({ turnIndex: 1 });
    expect(state.apiPost).toHaveBeenCalledWith(
      `/sessions/${sessionId}/turns`,
      expect.anything(),
      { turnIndex: 1, choiceValue: "BACKEND" },
      expect.anything(),
    );
  });
});
