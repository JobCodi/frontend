import { PageFrame } from "@/components/layout/page-frame";
import { PageHeader } from "@/components/layout/page-header";
import { apiGet, ApiError } from "@/lib/api/client";
import { IngestionSourcesResponseSchema, type IngestionSource } from "@/lib/schemas/ingestion";

export const metadata = { title: "서비스 소개 | JobCodi" };

async function loadSources(): Promise<IngestionSource[]> {
  try {
    return (await apiGet("/ingestion/sources", IngestionSourcesResponseSchema, { next: { revalidate: 3600 } })).sources;
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) return [];
    throw error;
  }
}

const sections = [
  ["공고 본문을 저장하지 않아요", "JobCodi는 공고 본문을 저장하거나 다시 보여주지 않아요. 상세 화면에는 메타데이터와 매칭 근거만 표시하고, 실제 내용과 지원은 항상 원문 사이트로 연결해 드려요."],
  ["세션 ID와 링크 공유 주의", "세션 ID는 URL에 그대로 노출돼요. 대화나 피드 링크를 다른 사람과 공유하면 그 사람도 같은 세션을 볼 수 있으니 주의해 주세요."],
  ["세션은 24시간 후 만료돼요", "로그인이 없는 대신, 대화와 조건은 24시간 동안만 보관돼요. 그 이후에는 새로 시작해야 해요."],
] as const;

export default async function AboutPage() {
  const sources = await loadSources();
  return (
    <PageFrame as="main" size="narrow" className="flex flex-col gap-8 sm:gap-10">
      <PageHeader eyebrow="About JobCodi" title="JobCodi는 무엇을 하는 서비스인가요" description="기업 규모와 직군을 고르면, AI가 대화로 5턴 안에 검색 조건을 정교화하고 여러 채용 소스에서 수집한 공고를 한곳에 모아 보여드려요." />
      <section className="ui-card p-[var(--card-space)]"><h2 className="ui-section-title">공고는 어디서 가져오나요</h2>{sources.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{sources.map((source) => <li key={source.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4"><p className="ui-card-title">{source.displayName}</p><p className="ui-body mt-1">{source.enabled ? "수집 중" : "현재 사용 안 함"}</p></li>)}</ul> : <p className="ui-body mt-3">고용24 · 사람인 · 기업 채용 페이지에서 공고를 모아옵니다. (소스 목록을 지금은 불러오지 못했어요.)</p>}</section>
      {sections.map(([title, body]) => <section key={title} className="border-t border-[var(--line)] pt-6"><h2 className="ui-section-title">{title}</h2><p className="ui-body mt-3">{body}</p></section>)}
    </PageFrame>
  );
}
