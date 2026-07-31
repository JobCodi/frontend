import { apiGet, ApiError } from "@/lib/api/client";
import { IngestionSourcesResponseSchema, type IngestionSource } from "@/lib/schemas/ingestion";

export const metadata = {
  title: "서비스 소개 | JobCodi",
};

async function loadSources(): Promise<IngestionSource[]> {
  try {
    const response = await apiGet("/ingestion/sources", IngestionSourcesResponseSchema, {
      next: { revalidate: 3600 },
    });
    return response.sources;
  } catch (err) {
    if (err instanceof ApiError || err instanceof Error) {
      return [];
    }
    throw err;
  }
}

export default async function AboutPage() {
  const sources = await loadSources();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-12">
      <section>
        <h1 className="text-[22px] font-semibold leading-[30px] text-[var(--text)]">
          JobCodi는 무엇을 하는 서비스인가요
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-[var(--text-muted)]">
          기업 규모와 직군을 고르면, AI가 대화로 5턴 안에 검색 조건을 정교화하고,
          여러 채용 소스에서 수집한 공고를 한곳에 모아 보여드려요. 로그인 없이
          바로 시작할 수 있고, 세션 ID 하나로 진행 상황을 이어갈 수 있어요.
        </p>
      </section>

      <section>
        <h2 className="text-[15px] font-semibold text-[var(--text)]">공고는 어디서 가져오나요</h2>
        {sources.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3"
              >
                <p className="text-sm font-medium text-[var(--text)]">{source.displayName}</p>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                  {source.enabled ? "수집 중" : "현재 사용 안 함"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            고용24 · 사람인 · 기업 채용 페이지에서 공고를 모아옵니다. (소스 목록을 지금은
            불러오지 못했어요.)
          </p>
        )}
      </section>

      <section>
        <h2 className="text-[15px] font-semibold text-[var(--text)]">공고 본문을 저장하지 않아요</h2>
        <p className="mt-3 text-[15px] leading-6 text-[var(--text-muted)]">
          JobCodi는 공고 본문을 저장하거나 다시 보여주지 않아요. 상세 화면에는
          메타데이터와 매칭 근거만 표시하고, 실제 내용과 지원은 항상 원문
          사이트로 연결해 드려요.
        </p>
      </section>

      <section>
        <h2 className="text-[15px] font-semibold text-[var(--text)]">세션 ID와 링크 공유 주의</h2>
        <p className="mt-3 text-[15px] leading-6 text-[var(--text-muted)]">
          세션 ID는 URL에 그대로 노출돼요. 대화나 피드 링크를 다른 사람과
          공유하면 그 사람도 같은 세션을 볼 수 있으니 주의해 주세요.
        </p>
      </section>

      <section>
        <h2 className="text-[15px] font-semibold text-[var(--text)]">세션은 24시간 후 만료돼요</h2>
        <p className="mt-3 text-[15px] leading-6 text-[var(--text-muted)]">
          로그인이 없는 대신, 대화와 조건은 24시간 동안만 보관돼요. 그 이후에는
          새로 시작해야 해요.
        </p>
      </section>
    </main>
  );
}
