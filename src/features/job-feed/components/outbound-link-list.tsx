import { ExternalLink } from "lucide-react";
import { isSafeOutboundUrl } from "@/lib/utils/outbound-url";
import type { JobView } from "../lib/to-job-view";

interface OutboundLinkListProps {
  job: JobView;
}

export function OutboundLinkList({ job }: OutboundLinkListProps) {
  const hasSafeOutboundUrl = isSafeOutboundUrl(job.url);

  return (
    <ul className="flex flex-col gap-3">
      <li className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <span className="font-medium text-gray-900">{job.sourceLabel}</span>
        {hasSafeOutboundUrl ? (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-200 transition-all hover:from-indigo-600 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            원문 보기
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
            원문 링크를 확인할 수 없어요
          </span>
        )}
      </li>
      {job.alsoFoundOnLabels.map((label) => (
        <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-4">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="rounded-lg bg-white px-3 py-1.5 text-xs text-gray-500">
            같은 공고가 있어요
          </span>
        </li>
      ))}
    </ul>
  );
}
