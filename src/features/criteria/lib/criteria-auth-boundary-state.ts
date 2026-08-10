type CriteriaAuthBoundaryState =
  | { state: "loading"; canQuery: false }
  | { state: "redirect"; canQuery: false }
  | { state: "ready"; canQuery: true };

interface CriteriaAuthBoundaryInput {
  isAuthLoading: boolean;
  hasUser: boolean;
}

export function getCriteriaAuthBoundaryState({
  isAuthLoading,
  hasUser,
}: CriteriaAuthBoundaryInput): CriteriaAuthBoundaryState {
  if (isAuthLoading) return { state: "loading", canQuery: false };
  if (!hasUser) return { state: "redirect", canQuery: false };
  return { state: "ready", canQuery: true };
}
