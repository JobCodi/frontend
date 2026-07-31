import { Check, Loader2 } from "lucide-react";
import type { SourceProgress } from "@/lib/schemas/feed";
import { FeedCardSkeleton } from "./job-list";

interface CollectingChecklistProps {
  sourceProgress: SourceProgress[];
}

/** role="status" so assistive tech announces collection progress (product.md §7). */
export function CollectingChecklist({ sourceProgress }: CollectingChecklistProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[15px] font-medium text-[var(--text)]">
          여러 채용 사이트에서 공고를 모으고 있어요.
        </p>
        <ul role="status" className="mt-3 flex flex-col gap-2">
          {sourceProgress.map((source) => (
            <li key={source.source} className="flex items-center gap-2 text-sm">
              {source.status === "done" ? (
                <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--match)]" />
              ) : source.status === "in_progress" ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin text-[var(--brand)]" />
              ) : (
                <span aria-hidden="true" className="h-4 w-4 shrink-0 text-center text-[var(--text-subtle)]">
                  ·
                </span>
              )}
              <span className="text-[var(--text)]">{source.label}</span>
              <span className="text-[var(--text-muted)]">
                {source.status === "done" && source.count !== undefined
                  ? `${source.count}건`
                  : source.status === "in_progress"
                    ? "수집 중..."
                    : source.status === "unused"
                      ? "사용 안 함"
                      : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FeedCardSkeleton />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </div>
    </div>
  );
}
