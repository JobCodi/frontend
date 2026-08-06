import { Check, AlertTriangle, MinusCircle } from "lucide-react";
import type { MatchReason } from "@/lib/schemas";

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
        return <Check className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />;
      case "caution":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "gap":
        return <MinusCircle className="h-4 w-4 text-gray-400" />;
    }
  }

  return (
    <ul className="space-y-1.5">
      {visibleReasons.map((reason, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
          {getIcon(reason.kind)}
          <span className="flex-1 leading-tight">{reason.text}</span>
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className="text-xs text-gray-400">+{hiddenCount}개 더 보기</li>
      ) : null}
    </ul>
  );
}
