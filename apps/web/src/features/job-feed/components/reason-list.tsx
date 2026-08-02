import { Check, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { MatchReason } from "@/lib/schemas/common";

const REASON_ICON = {
  match: Check,
  caution: TriangleAlert,
  gap: X,
} as const;

const REASON_COLOR = {
  match: "text-[var(--match)]",
  caution: "text-[var(--caution)]",
  gap: "text-[var(--gap)]",
} as const;

interface ReasonListProps {
  reasons: MatchReason[];
  /** Card view truncates to 4 with a "+n개 더" line; detail view shows all. */
  maxVisible?: number;
}

/**
 * Renders MatchReason[]. Icons are decorative (aria-hidden) — kind is
 * always conveyed through the icon shape AND the text, never color alone
 * (design-system.md §2 / Rules.md §2.1).
 */
export function ReasonList({ reasons, maxVisible }: ReasonListProps) {
  const visible = maxVisible ? reasons.slice(0, maxVisible) : reasons;
  const remaining = maxVisible ? reasons.length - maxVisible : 0;

  return (
    <ul className="flex flex-col gap-1.5">
      {visible.map((reason, index) => {
        const Icon = REASON_ICON[reason.kind];
        return (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Icon
              aria-hidden="true"
              className={cn("mt-0.5 h-4 w-4 shrink-0", REASON_COLOR[reason.kind])}
            />
            <span className="text-[var(--text)]">{reason.text}</span>
          </li>
        );
      })}
      {remaining > 0 ? (
        <li className="pl-6 text-xs text-[var(--text-subtle)]">+{remaining}개 더</li>
      ) : null}
    </ul>
  );
}
