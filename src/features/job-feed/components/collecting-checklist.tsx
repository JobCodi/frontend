import { Loader2 } from "lucide-react";
import type { FeedCollectingPage } from "@/lib/schemas/feed";
import { FeedCardSkeleton } from "./job-list";

interface CollectingChecklistProps {
  progress: FeedCollectingPage["progress"];
}

export function CollectingChecklist({ progress }: CollectingChecklistProps) {
  const pct =
    progress.totalSources > 0
      ? Math.round((progress.completedSources / progress.totalSources) * 100)
      : 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-card)]">
      <div className="border-b border-[var(--line)] bg-gradient-to-r from-[var(--brand-soft)]/50 to-white px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.25)]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-[var(--text)]">공고를 모으고 있어요</p>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              소스 {progress.completedSources}/{progress.totalSources} 완료 · {pct}%
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[#7c3aed] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </div>
    </div>
  );
}
