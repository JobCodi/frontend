import { Info } from "lucide-react";
import { formatDateLong, formatDday } from "@/lib/utils/date";
import type { JobView } from "../lib/to-job-view";
import { ReasonList } from "./reason-list";
import { OutboundLinkList } from "./outbound-link-list";

interface JobDetailProps {
  job: JobView;
}

/**
 * Metadata + match reasons + outbound links only. NEVER renders posting
 * body text — the backend doesn't store or return it (AGENTS.md #3).
 */
export function JobDetail({ job }: JobDetailProps) {
  const dday = formatDday(job.closesAt, job.isRolling);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[var(--text-muted)]">
          {[job.employmentTypeLabel, job.companySizeLabel, job.regionLabel]
            .filter((value) => value !== null)
            .join(" · ")}
        </p>
        <h2 className="mt-1 text-[22px] font-semibold leading-[30px] text-[var(--text)]">
          {job.title}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">{job.companyName}</p>
      </div>

      <section aria-labelledby="job-detail-reasons">
        <h3 id="job-detail-reasons" className="mb-2 text-[13px] font-medium text-[var(--text-muted)]">
          왜 추천했나요
        </h3>
        <ReasonList reasons={job.reasons} />
      </section>

      <section aria-labelledby="job-detail-meta">
        <h3 id="job-detail-meta" className="mb-2 text-[13px] font-medium text-[var(--text-muted)]">
          공고 정보
        </h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-[var(--text-muted)]">경력</dt>
          <dd className="text-[var(--text)]">{job.experienceLabel ?? "정보 없음"}</dd>
          <dt className="text-[var(--text-muted)]">급여</dt>
          <dd className="text-[var(--text)]">{job.salaryText ?? "회사 내규에 따름"}</dd>
          <dt className="text-[var(--text-muted)]">마감</dt>
          <dd className="text-[var(--text)]">
            {job.isRolling
              ? "상시채용"
              : job.closesAt
                ? `${formatDateLong(job.closesAt)}${dday ? ` (${dday.label})` : ""}`
                : "정보 없음"}
          </dd>
          {job.techStack.length > 0 ? (
            <>
              <dt className="text-[var(--text-muted)]">기술</dt>
              <dd className="text-[var(--text)]">{job.techStack.join(" · ")}</dd>
            </>
          ) : null}
        </dl>
      </section>

      <section aria-labelledby="job-detail-links">
        <h3 id="job-detail-links" className="mb-2 text-[13px] font-medium text-[var(--text-muted)]">
          이 공고를 볼 수 있는 곳
        </h3>
        <OutboundLinkList job={job} />
      </section>

      <p className="flex items-start gap-2 text-xs text-[var(--text-subtle)]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        상세 내용과 지원은 원문 사이트에서 확인해 주세요.
      </p>
    </div>
  );
}
