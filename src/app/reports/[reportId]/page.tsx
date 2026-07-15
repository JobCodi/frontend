import Link from "next/link";
import styles from "./report-page.module.css";

interface JobMatch {
  jobName: string;
  score: number;
  badge: string;
  fitDetail: number;
  interestDetail: number;
  growthDetail: number;
  difficulty: string;
  expectedPostCount: string;
}

interface ParsedResume {
  experiences: string[];
  skills: string[];
  strengths: string[];
  jobKeywords: string[];
  summary: string;
}

interface ReportState {
  completedActions?: string[];
  applicationStatuses?: Array<{ leadId: string; status: string; updatedAt: string }>;
}

interface SharedReport {
  reportId: string;
  draftId: string;
  userId: string;
  completedAt: string;
  topRecommendation: JobMatch;
  recommendations: JobMatch[];
  resume: ParsedResume;
  reportState?: ReportState;
}

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
}

async function fetchReport(reportId: string): Promise<{ report?: SharedReport; error?: string; unconfigured?: boolean }> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    return { unconfigured: true, error: "NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다." };
  }

  try {
    const response = await fetch(`${baseUrl}/api/reports/${encodeURIComponent(reportId)}`, { cache: "no-store" });
    if (response.status === 404) {
      return { error: "요청한 리포트를 찾을 수 없습니다." };
    }
    if (!response.ok) {
      return { error: `리포트를 불러오지 못했습니다. (${response.status})` };
    }
    return { report: (await response.json()) as SharedReport };
  } catch {
    return { error: "백엔드 API에 연결할 수 없습니다." };
  }
}

const applicationStatusLabels: Record<string, string> = {
  saved: "저장",
  planned: "지원예정",
  applied: "지원완료",
};

function formatCompletedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function summarizeApplicationStatuses(statuses: ReportState["applicationStatuses"] = []) {
  return statuses.reduce<Record<string, number>>((summary, item) => {
    summary[item.status] = (summary[item.status] ?? 0) + 1;
    return summary;
  }, {});
}

export default async function SharedReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const { report, error, unconfigured } = await fetchReport(reportId);

  if (!report) {
    return (
      <main className={styles.pageShell}>
        <section className={styles.emptyState}>
          <span>JobCodi Shared Report</span>
          <h1>{unconfigured ? "공유 리포트 API가 연결되지 않았습니다" : "리포트를 열 수 없습니다"}</h1>
          <p>{error}</p>
          <div className={styles.helpBox}>
            <strong>로컬에서 확인하려면</strong>
            <code>NEXT_PUBLIC_API_BASE_URL=http://localhost:4010 npm run dev</code>
          </div>
          <Link href="/">새 진단 시작하기</Link>
        </section>
      </main>
    );
  }

  const completedActions = report.reportState?.completedActions ?? [];
  const applicationStatuses = report.reportState?.applicationStatuses ?? [];
  const completedCount = completedActions.length;
  const applicationCount = applicationStatuses.length;
  const applicationSummary = summarizeApplicationStatuses(applicationStatuses);

  return (
    <main className={styles.pageShell}>
      <section className={styles.hero}>
        <div>
          <span>JobCodi Shared Report</span>
          <h1>{report.topRecommendation.jobName} 추천 리포트</h1>
          <p>{report.resume.summary}</p>
        </div>
        <div className={styles.scoreCard}>
          <strong>{report.topRecommendation.score}</strong>
          <small>FIT SCORE</small>
        </div>
      </section>

      <section className={styles.metaGrid}>
        <article>
          <span>리포트 ID</span>
          <strong>{report.reportId}</strong>
        </article>
        <article>
          <span>완료 시각</span>
          <strong>{formatCompletedAt(report.completedAt)}</strong>
        </article>
        <article>
          <span>액션 진행</span>
          <strong>{completedCount}개 완료</strong>
        </article>
        <article>
          <span>지원 후보 상태</span>
          <strong>{applicationCount}개 기록</strong>
        </article>
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.panel}>
          <span>Top Recommendations</span>
          <h2>추천 직무 Top {report.recommendations.length}</h2>
          <div className={styles.recommendationList}>
            {report.recommendations.map((job, index) => (
              <div key={job.jobName}>
                <b>{index + 1}</b>
                <div>
                  <strong>{job.jobName}</strong>
                  <small>{job.badge} · {job.score}점 · 난이도 {job.difficulty}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <span>Resume Signals</span>
          <h2>이력서 핵심 신호</h2>
          <div className={styles.tagCloud}>
            {report.resume.skills.map((skill) => <em key={skill}>{skill}</em>)}
            {report.resume.strengths.map((strength) => <em key={strength}>{strength}</em>)}
          </div>
          <ul>
            {report.resume.experiences.slice(0, 3).map((experience) => <li key={experience}>{experience}</li>)}
          </ul>
        </article>
      </section>

      <section className={styles.statusPanel}>
        <div>
          <span>Execution Status</span>
          <h2>저장 당시 실행 현황</h2>
          <p>공유받은 사람이 현재 리포트가 단순 추천인지, 실제 지원 준비까지 이어진 상태인지 바로 이해할 수 있도록 정리했습니다.</p>
        </div>
        <div className={styles.statusGrid}>
          <article>
            <strong>{completedCount}</strong>
            <span>완료 액션</span>
            {completedActions.length > 0 ? (
              <ul>
                {completedActions.slice(0, 4).map((action) => <li key={action}>{action}</li>)}
              </ul>
            ) : (
              <p>아직 완료한 체크리스트가 없습니다.</p>
            )}
          </article>
          <article>
            <strong>{applicationCount}</strong>
            <span>지원 후보 기록</span>
            {applicationStatuses.length > 0 ? (
              <div className={styles.statusPills}>
                {Object.entries(applicationSummary).map(([status, count]) => (
                  <em key={status}>{applicationStatusLabels[status] ?? status} {count}</em>
                ))}
              </div>
            ) : (
              <p>아직 저장/지원예정/지원완료 상태가 기록되지 않았습니다.</p>
            )}
          </article>
        </div>
      </section>

      <section className={styles.ctaPanel}>
        <div>
          <span>Next Step</span>
          <h2>이 리포트를 바탕으로 다음 지원 액션을 이어가세요</h2>
          <p>JobCodi 진단을 다시 실행하면 최신 이력과 관심 조건으로 추천을 업데이트할 수 있습니다.</p>
        </div>
        <Link href="/">새 진단 시작하기</Link>
      </section>
    </main>
  );
}
