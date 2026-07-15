import Link from "next/link";
import styles from "./reports-index.module.css";

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

interface ReportSummary {
  reportId: string;
  draftId: string;
  userId: string;
  completedAt: string;
  topRecommendation: JobMatch;
}

interface ReportListResponse {
  reports: ReportSummary[];
}

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
}

async function fetchReports(): Promise<{ reports?: ReportSummary[]; error?: string; unconfigured?: boolean }> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    return { unconfigured: true, error: "NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다." };
  }

  try {
    const response = await fetch(`${baseUrl}/api/reports`, { cache: "no-store" });
    if (!response.ok) {
      return { error: `리포트 목록을 불러오지 못했습니다. (${response.status})` };
    }
    const payload = (await response.json()) as ReportListResponse;
    return { reports: payload.reports };
  } catch {
    return { error: "백엔드 API에 연결할 수 없습니다." };
  }
}

function formatCompletedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function ReportsIndexPage() {
  const { reports, error, unconfigured } = await fetchReports();

  return (
    <main className={styles.pageShell}>
      <section className={styles.hero}>
        <div>
          <span>JOBCODI REPORTS</span>
          <h1>서버 저장 리포트</h1>
          <p>백엔드에 완료 저장된 JobCodi 리포트를 최신순으로 확인하고 공유 리포트 페이지로 바로 이동합니다.</p>
        </div>
        <Link href="/">새 진단 시작하기</Link>
      </section>

      {error ? (
        <section className={styles.emptyState}>
          <span>{unconfigured ? "API 설정 필요" : "연결 실패"}</span>
          <h2>{unconfigured ? "리포트 목록 API가 연결되지 않았습니다" : "리포트 목록을 열 수 없습니다"}</h2>
          <p>{error}</p>
          <div className={styles.helpBox}>
            <strong>로컬에서 확인하려면</strong>
            <code>NEXT_PUBLIC_API_BASE_URL=http://localhost:4010 npm run dev</code>
          </div>
        </section>
      ) : reports && reports.length > 0 ? (
        <section className={styles.reportGrid} aria-label="서버 저장 리포트 목록">
          {reports.map((report) => (
            <article key={report.reportId} className={styles.reportCard}>
              <div className={styles.cardHeader}>
                <span>{report.topRecommendation.badge}</span>
                <strong>{report.topRecommendation.score}</strong>
              </div>
              <h2>{report.topRecommendation.jobName}</h2>
              <p>{formatCompletedAt(report.completedAt)} 완료</p>
              <dl>
                <div>
                  <dt>리포트 ID</dt>
                  <dd>{report.reportId}</dd>
                </div>
                <div>
                  <dt>난이도</dt>
                  <dd>{report.topRecommendation.difficulty}</dd>
                </div>
                <div>
                  <dt>예상 공고</dt>
                  <dd>{report.topRecommendation.expectedPostCount}</dd>
                </div>
              </dl>
              <Link href={`/reports/${report.reportId}`}>공유 리포트 열기</Link>
            </article>
          ))}
        </section>
      ) : (
        <section className={styles.emptyState}>
          <span>EMPTY</span>
          <h2>아직 서버에 완료 리포트가 없습니다</h2>
          <p>최종 리포트 화면에서 백엔드 저장을 완료하면 이곳에 최신 리포트가 표시됩니다.</p>
          <Link href="/">첫 리포트 만들기</Link>
        </section>
      )}
    </main>
  );
}
