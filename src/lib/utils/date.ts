const DAY_MS = 1000 * 60 * 60 * 24;

/** Days remaining until `closesAt` (may be negative if already past). */
export function daysUntil(closesAt: string): number {
  const target = new Date(closesAt).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / DAY_MS);
}

export interface DdayBadge {
  label: string;
  /** Deadline is within 3 days — render with emphasis color per screens.md. */
  urgent: boolean;
}

/**
 * Builds the D-day badge shown on job cards / detail. `isRolling` always
 * wins and shows "상시채용" instead of a countdown.
 */
export function formatDday(
  closesAt: string | null,
  isRolling: boolean,
): DdayBadge | null {
  if (isRolling) return { label: "상시채용", urgent: false };
  if (!closesAt) return null;
  const days = daysUntil(closesAt);
  if (days < 0) return { label: "마감", urgent: false };
  return { label: `D-${days}`, urgent: days <= 3 };
}

/** "2일 전" / "방금 전" style relative-time label for postedAt. */
export function formatRelativeTime(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (diffMs < 0) return "방금 전";
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  return `${Math.floor(months / 12)}년 전`;
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
