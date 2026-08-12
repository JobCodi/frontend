let accessToken: string | null = null;
let accessTokenExpiresAt: string | null = null;

/** Access credentials deliberately live only for the lifetime of this JS module. */
export function setAccessToken(token: string, expiresAt: string): void {
  accessToken = token;
  accessTokenExpiresAt = expiresAt;
}

export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * An absent or malformed expiry is never trusted as a fresh credential.
 * This keeps malformed backend data from delaying a required refresh.
 */
export function isAccessTokenExpired(): boolean {
  if (accessToken === null) return false;

  const expiresAt =
    typeof accessTokenExpiresAt === "string" ? Date.parse(accessTokenExpiresAt) : Number.NaN;
  return !Number.isFinite(expiresAt) || expiresAt <= Date.now();
}

export function clearAccessToken(): void {
  accessToken = null;
  accessTokenExpiresAt = null;
}
