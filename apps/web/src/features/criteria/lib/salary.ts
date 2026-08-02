const MANWON = 10_000;

/**
 * `criteria.payload.salaryMin` is in KRW (원) — e.g. 32000000 — while the
 * UI talks in 만원. Everything crossing the API boundary stays in 원.
 */
export function toManwon(won: number): number {
  return Math.round(won / MANWON);
}

export function fromManwon(manwon: number): number {
  return Math.round(manwon) * MANWON;
}

export function formatSalaryManwon(won: number): string {
  return toManwon(won).toLocaleString("ko-KR");
}
