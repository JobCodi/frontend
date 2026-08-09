import { Building2, Info, MapPin } from "lucide-react";
import { formatDateLong, formatDday } from "@/lib/utils/date";
import type { JobView } from "../lib/to-job-view";
import { ReasonList } from "./reason-list";
import { MatchEvidencePanel } from "./match-evidence-panel";
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
  const avatarLetter = job.companyName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--surface-soft)] to-white text-lg font-bold text-[var(--text)] ring-1 ring-[var(--line)]">
              {avatarLetter}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">{job.companyName}</p>
              <h2 className="mt-1 text-2xl font-semibold leading-8 tracking-tight text-[var(--text)]">
                {job.title}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[job.employmentTypeLabel, job.companySizeLabel, job.regionLabel]
                  .filter((value): value is string => Boolean(value))
                  .map((label) => (
                    <span
                      key={label}
                      className="rounded-lg bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] ring-1 ring-[var(--line)]"
                    >
                      {label}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.28)]">
            <strong className="text-xl font-bold leading-none">{job.score}</strong>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-80">
              match
            </span>
          </div>
        </div>
      </section>

      <MatchEvidencePanel job={job} />

      <section
        aria-labelledby="job-detail-reasons"
        className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
      >
        <h3 id="job-detail-reasons" className="mb-3 text-sm font-semibold text-[var(--text)]">
          왜 추천했나요
        </h3>
        <ReasonList reasons={job.reasons} />
      </section>

      <section
        aria-labelledby="job-detail-meta"
        className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
      >
        <h3 id="job-detail-meta" className="mb-4 text-sm font-semibold text-[var(--text)]">
          공고 정보
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)]">
              <Building2 className="h-3.5 w-3.5" />
              경력
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text)]">
              {job.experienceLabel ?? "정보 없음"}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4">
            <dt className="text-xs font-medium text-[var(--text-subtle)]">급여</dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text)]">
              {job.salaryText ?? "회사 내규에 따름"}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4">
            <dt className="text-xs font-medium text-[var(--text-subtle)]">마감</dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text)]">
              {job.isRolling
                ? "상시채용"
                : job.closesAt
                  ? `${formatDateLong(job.closesAt)}${dday ? ` (${dday.label})` : ""}`
                  : "정보 없음"}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)]">
              <MapPin className="h-3.5 w-3.5" />
              출처
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-[var(--text)]">{job.sourceLabel}</dd>
          </div>
          {job.techStack.length > 0 ? (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4 sm:col-span-2">
              <dt className="text-xs font-medium text-[var(--text-subtle)]">기술</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {job.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[var(--text)] ring-1 ring-[var(--line)]"
                  >
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section
        aria-labelledby="job-detail-links"
        className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
      >
        <h3 id="job-detail-links" className="mb-3 text-sm font-semibold text-[var(--text)]">
          이 공고를 볼 수 있는 곳
        </h3>
        <OutboundLinkList job={job} />
      </section>

      <p className="flex items-start gap-2 px-1 text-xs leading-5 text-[var(--text-subtle)]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        상세 내용과 지원은 원문 사이트에서 확인해 주세요. JobCodi는 공고 본문을 저장하지 않습니다.
      </p>
    </div>
  );
}
