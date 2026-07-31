import { ExternalLink } from "lucide-react";
import type { FeedItem } from "@/lib/schemas/feed";

interface OutboundLinkListProps {
  item: FeedItem;
}

/**
 * The primary source plus any `alsoFoundOn` mirrors. Every link opens in a
 * new tab with rel="noopener noreferrer" — this is the ONLY way to reach
 * the posting body; JobCodi never stores or renders it itself.
 */
export function OutboundLinkList({ item }: OutboundLinkListProps) {
  const entries = [
    { source: item.source, label: item.sourceLabel, url: item.url },
    ...item.alsoFoundOn.filter((entry) => entry.url),
  ];

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li key={entry.source} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--text)]">{entry.label}</span>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-[var(--radius)] px-2 py-1 font-medium text-[var(--brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            원문 보기
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
