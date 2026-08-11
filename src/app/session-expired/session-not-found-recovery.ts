import { safeAuthRedirect } from "@/lib/auth/redirect";

const startHref = "/start";

export const sessionNotFoundRecovery = {
  title: "세션을 열 수 없어요.",
  description:
    "세션이 만료되었거나, 처음 사용한 계정으로 로그인해야 할 수 있어요.",
  startHref,
  switchAccountHref: `/login?redirect=${encodeURIComponent(safeAuthRedirect(startHref))}`,
} as const;
