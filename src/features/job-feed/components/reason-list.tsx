import { Check, AlertTriangle, MinusCircle } from "lucide-react";
import type { MatchReason } from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";

interface ReasonListProps {
  reasons: readonly MatchReason[];
  maxVisible?: number;
}

export function ReasonList({ reasons, maxVisible = 3 }: ReasonListProps) {
  const visibleReasons = reasons.slice(0, maxVisible);
  const hiddenCount = reasons.length - maxVisible;

  function getIcon(kind: MatchReason["kind"]) {
    switch (kind) {
      case "match":
        return <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />;
      case "caution":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />;
      case "gap":
        return <MinusCircle className="h-3.5 w-3.5 text-slate-400" />;
    }
  }

  function tone(kind: MatchReason["kind"]) {
    switch (kind) {
      case "match":
        return "bg-emerald-50 text-emerald-800 ring-emerald-100";
      case "caution":
        return "bg-amber-50 text-amber-800 ring-amber-100";
      case "gap":
        return "bg-slate-50 text-slate-600 ring-slate-100";
    }
  }

  return (
    <ul className="space-y-1.5">
      {visibleReasons.map((reason, idx) => (
        <li
          key={idx}
          className={cn(
            "flex items-start gap-2 rounded-xl px-2.5 py-2 text-sm leading-5 ring-1",
            tone(reason.kind),
          )}
        >
          <span className="mt-0.5">{getIcon(reason.kind)}</span>
          <span className="flex-1">{reason.text}</span>
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className="px-1 text-xs font-medium text-[var(--text-subtle)]">+{hiddenCount}개 더 보기</li>
      ) : null}
    </ul>
  );
}
