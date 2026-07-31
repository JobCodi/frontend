import { Info } from "lucide-react";
import { formatDateLong, formatDday } from "@/lib/utils/date";
import type { FeedItem } from "@/lib/schemas/feed";
import { ReasonList } from "./reason-list";
import { OutboundLinkList } from "./outbound-link-list";

interface JobDetailProps {
  item: FeedItem;
}

/**
 * Metadata + match reasons + outbound links only. NEVER renders posting
 * body text — the backend doesn't store or return it (AGENTS.md #3).
 */
export function JobDetail({ item }: JobDetailProps) {
  const dday = formatDday(item.closesAt, item.isRolling);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[var(--text-muted)]">
          {[item.employmentType, item.companySize, item.region].filter(Boolean).join(" · ")}
        </p>
        <h2 className="mt-1 text-[22px] font-semibold leading-[30px] text-[var(--text)]">
          {item.title}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">{item.company}</p>
      </div>

      <section aria-labelledby="job-detail-reasons">
        <h3 id="job-detail-reasons" className="mb-2 text-[13px] font-medium text-[var(--text-muted)]">
          왜 추천했나요
        </h3>
        <ReasonList reasons={item.reasons} />
      </section>

      <section aria-labelledby="job-detail-meta">
        <h3 id="job-detail-meta" className="mb-2 text-[13px] font-medium text-[var(--text-muted)]">
          공고 정보
        </h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-[var(--text-muted)]">경력</dt>
          <dd className="text-[var(--text)]">{item.experienceLevel ?? "정보 없음"}</dd>
          <dt className="text-[var(--text-muted)]">급여</dt>
          <dd className="text-[var(--text)]">{item.salaryText ?? "회사 내규에 따름"}</dd>
          <dt className="text-[var(--text-muted)]">마감</dt>
          <dd className="text-[var(--text)]">
            {item.isRolling
              ? "상시채용"
              : item.closesAt
                ? `${formatDateLong(item.closesAt)}${dday ? ` (${dday.label})` : ""}`
                : "정보 없음"}
          </dd>
          {item.techStack.length > 0 ? (
            <>
              <dt className="text-[var(--text-muted)]">기술</dt>
              <dd className="text-[var(--text)]">{item.techStack.join(" · ")}</dd>
            </>
          ) : null}
        </dl>
      </section>

      <section aria-labelledby="job-detail-links">
        <h3 id="job-detail-links" className="mb-2 text-[13px] font-medium text-[var(--text-muted)]">
          이 공고를 볼 수 있는 곳
        </h3>
        <OutboundLinkList item={item} />
      </section>

      <p className="flex items-start gap-2 text-xs text-[var(--text-subtle)]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        상세 내용과 지원은 원문 사이트에서 확인해 주세요.
      </p>
    </div>
  );
}
