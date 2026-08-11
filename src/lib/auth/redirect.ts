/** Prevent open redirects after authentication. */
export function safeAuthRedirect(value: string | null): string {
  if (value === null || !value.startsWith("/") || value.startsWith("//")) return "/start";
  try {
    return new URL(value, "https://jobcodi.local").origin === "https://jobcodi.local" ? value : "/start";
  } catch {
    return "/start";
  }
}
