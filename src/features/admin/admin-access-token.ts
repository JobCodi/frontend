let adminAccessToken: string | null = null;

export function setAdminAccessToken(token: string): void {
  adminAccessToken = token;
}

export function getAdminAccessToken(): string | null {
  return adminAccessToken;
}

export function clearAdminAccessToken(): void {
  adminAccessToken = null;
}
