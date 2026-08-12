type DiscoveryAuthBoundaryState =
  | { state: "loading"; canQuery: false }
  | { state: "redirect"; canQuery: false }
  | { state: "ready"; canQuery: true };

interface DiscoveryAuthBoundaryInput {
  isAuthLoading: boolean;
  hasUser: boolean;
}

export function getDiscoveryAuthBoundaryState({
  isAuthLoading,
  hasUser,
}: DiscoveryAuthBoundaryInput): DiscoveryAuthBoundaryState {
  if (isAuthLoading) return { state: "loading", canQuery: false };
  if (!hasUser) return { state: "redirect", canQuery: false };
  return { state: "ready", canQuery: true };
}
