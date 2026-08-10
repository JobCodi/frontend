type ActiveProfileGateState = "loading" | "error" | "form" | "redirect";

interface ActiveProfileGateQueryState {
  isPending: boolean;
  isError: boolean;
  profile: object | null | undefined;
}

export function getActiveProfileGateState({
  isPending,
  isError,
  profile,
}: ActiveProfileGateQueryState): ActiveProfileGateState {
  if (isPending) return "loading";
  if (isError || profile === undefined) return "error";
  return profile === null ? "form" : "redirect";
}
