/**
 * Returns whether a posting destination is an absolute HTTP(S) URL.
 * Posting URLs originate outside JobCodi, so they must never be treated as
 * executable or same-origin links.
 */
export function isSafeOutboundUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
