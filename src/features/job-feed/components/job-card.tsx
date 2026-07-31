import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDday, formatRelativeTime } from "@/lib/utils/date";
import type { FeedItem } from "@/lib/schemas/feed";
import { ReasonList } from "./reason-list";

interface JobCardProps {
  item: FeedItem;
  sessionId: string;
}

const MAX_VISIBLE_REASONS = 4;

export function JobCard({ item, sessionId }: JobCardProps) {
  const dday = formatDday(item.closesAt, item.isRolling);
  const postedLabel = formatRelativeTime(item.postedAt);

  return (
    <Link
      href={`/feed/${sessionId}/${item.id}`}
      className="flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
    >
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
        {item.employmentType ? <span>{item.employmentType}</span> : null}
        {item.companySize ? (
          <span className="flex items-center gap-1">
            · {item.companySize}
            {item.companySizeInferred ? (
              <Badge variant="neutral" className="px-1.5 py-0 text-[10px]">
                추정
              </Badge>
            ) : null}
          </span>
        ) : null}
        {item.region ? <span>· {item.region}</span> : null}
        {dday ? (
          <Badge
            variant={dday.urgent ? "danger" : "neutral"}
            className={cn("ml-auto", dday.urgent && "font-semibold")}
          >
            {dday.label}
          </Badge>
        ) : null}
      </div>

      <div>
        <p className="text-[15px] font-semibold leading-6 text-[var(--text)]">{item.title}</p>
        <p className="text-sm text-[var(--text-muted)]">{item.company}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold text-[var(--brand-strong)]">{item.score}점</p>
        <ReasonList reasons={item.reasons} maxVisible={MAX_VISIBLE_REASONS} />
      </div>

      <p className="text-xs text-[var(--text-subtle)]">
        {item.sourceLabel}
        {postedLabel ? ` · ${postedLabel}` : ""}
        {item.alsoFoundOn.length > 0
          ? ` · ${item.alsoFoundOn.map((a) => a.label).join(", ")}에도 게시`
          : ""}
      </p>
    </Link>
  );
}
