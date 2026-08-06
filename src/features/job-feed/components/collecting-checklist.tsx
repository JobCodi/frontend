import { Loader2 } from "lucide-react";
import type { FeedCollectingPage } from "@/lib/schemas/feed";
import { FeedCardSkeleton } from "./job-list";

interface CollectingChecklistProps {
  progress: FeedCollectingPage["progress"];
}

/**
 * While collecting, the backend only reports a source counter — no
 * per-source rows and no `sourceSummary` (that arrives with the finished
 * feed). role="status" so assistive tech announces progress (product.md §7).
 */
export function CollectingChecklist({ progress }: CollectingChecklistProps) {
  const percent =
    progress.totalSources > 0
      ? Math.round((progress.completedSources / progress.totalSources) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div role="status" className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-[15px] font-medium text-gray-900">
          <Loader2 aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin text-indigo-600" />
          여러 채용 사이트에서 공고를 모으고 있어요.
        </p>
        <p className="text-sm text-gray-500">
          {progress.totalSources > 0
            ? `채용 소스 ${progress.totalSources}곳 중 ${progress.completedSources}곳 완료 (${percent}%)`
            : "채용 소스를 확인하고 있어요."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FeedCardSkeleton />
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </div>
    </div>
  );
}
