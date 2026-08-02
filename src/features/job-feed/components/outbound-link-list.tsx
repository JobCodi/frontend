import { ExternalLink } from "lucide-react";
import { isSafeOutboundUrl } from "@/lib/utils/outbound-url";
import type { JobView } from "../lib/to-job-view";

interface OutboundLinkListProps {
  job: JobView;
}

/**
 * The primary source link, plus the names of any mirrors. The backend
 * reports `alsoFoundOn` as source ids only — it exposes no URL for the
 * duplicates — so mirrors are listed without a link rather than guessed at.
 * The primary link is the ONLY way to reach the posting body; JobCodi never
 * stores or renders it (Rules.md §2.3).
 */
export function OutboundLinkList({ job }: OutboundLinkListProps) {
  const hasSafeOutboundUrl = isSafeOutboundUrl(job.url);

  return (
    <ul className="flex flex-col gap-2">
      <li className="flex items-center justify-between gap-3 text-sm">
        <span className="text-[var(--text)]">{job.sourceLabel}</span>
        {hasSafeOutboundUrl ? (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-[var(--radius)] px-2 py-1 font-medium text-[var(--brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            원문 보기
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="px-2 py-1 text-xs text-[var(--text-subtle)]">원문 링크를 확인할 수 없어요</span>
        )}
      </li>
      {job.alsoFoundOnLabels.map((label) => (
        <li key={label} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--text)]">{label}</span>
          <span className="px-2 py-1 text-xs text-[var(--text-subtle)]">같은 공고가 있어요</span>
        </li>
      ))}
    </ul>
  );
}
