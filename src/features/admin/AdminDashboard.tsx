"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCrawlSite,
  getAdminMe,
  getAdminSources,
  getCrawlPlugins,
  getCrawlSites,
  runCrawlSite,
  updateCrawlSiteStatus,
  type CreateCrawlSitePayload,
} from "@/features/admin/admin-api";
import { ADMIN_ACCESS_TOKEN_KEY } from "@/features/admin/AdminLoginForm";
import { ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import type { CrawlSite, CrawlSiteStatus } from "@/lib/schemas/admin";

interface SelectorFields {
  itemSelector: string;
  titleSelector: string;
  linkSelector: string;
  companySelector: string;
  regionSelector: string;
  employmentTypeSelector: string;
  experienceSelector: string;
  postedAtSelector: string;
  closesAtSelector: string;
}

const emptySelectors: SelectorFields = {
  itemSelector: "",
  titleSelector: "",
  linkSelector: "",
  companySelector: "",
  regionSelector: "",
  employmentTypeSelector: "",
  experienceSelector: "",
  postedAtSelector: "",
  closesAtSelector: "",
};

const statusLabels: Record<CrawlSiteStatus, string> = {
  draft: "초안",
  pending_review: "검토 대기",
  active: "활성",
  suspended: "중지됨",
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function nextStatusAction(status: CrawlSiteStatus): { status: "pending_review" | "active" | "suspended"; label: string } | null {
  switch (status) {
    case "draft":
      return { status: "pending_review", label: "검토 요청" };
    case "pending_review":
      return { status: "active", label: "승인" };
    case "active":
      return { status: "suspended", label: "중지" };
    case "suspended":
      return null;
  }
}

function asOptionalSelector(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildPayload(form: HTMLFormElement, selectors: SelectorFields): CreateCrawlSitePayload {
  const formData = new FormData(form);
  return {
    displayName: String(formData.get("displayName") ?? "").trim(),
    termsUrl: String(formData.get("termsUrl") ?? "").trim(),
    entryUrls: String(formData.get("entryUrl") ?? "")
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0),
    minIntervalMs: Number(formData.get("minIntervalMs") ?? 2000),
    pluginId: "generic-static-list",
    pluginConfig: {
      itemSelector: selectors.itemSelector.trim(),
      titleSelector: selectors.titleSelector.trim(),
      linkSelector: selectors.linkSelector.trim(),
      companySelector: selectors.companySelector.trim(),
      regionSelector: asOptionalSelector(selectors.regionSelector),
      employmentTypeSelector: asOptionalSelector(selectors.employmentTypeSelector),
      experienceSelector: asOptionalSelector(selectors.experienceSelector),
      postedAtSelector: asOptionalSelector(selectors.postedAtSelector),
      closesAtSelector: asOptionalSelector(selectors.closesAtSelector),
      maxItems: Number(formData.get("maxItems") ?? 100),
    },
  };
}

function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10" role="status">
      <p className="text-sm text-[var(--text-muted)]">관리자 정보를 확인하는 중…</p>
    </main>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [accessToken] = useState(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY),
  );
  const [selectors, setSelectors] = useState<SelectorFields>(emptySelectors);
  const [formError, setFormError] = useState<string | null>(null);

  const me = useQuery({
    queryKey: queryKeys.adminMe(),
    queryFn: () => getAdminMe(accessToken ?? ""),
    enabled: accessToken !== null,
  });

  const sources = useQuery({
    queryKey: queryKeys.adminSources(),
    queryFn: () => getAdminSources(accessToken ?? ""),
    enabled: me.isSuccess,
  });
  const plugins = useQuery({
    queryKey: queryKeys.adminPlugins(),
    queryFn: () => getCrawlPlugins(accessToken ?? ""),
    enabled: me.isSuccess,
  });
  const crawlSites = useQuery({
    queryKey: queryKeys.adminCrawlSites(),
    queryFn: () => getCrawlSites(accessToken ?? ""),
    enabled: me.isSuccess,
  });

  useEffect(() => {
    if (accessToken === null || me.isError) {
      sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
      router.replace("/admin/login");
    }
  }, [accessToken, me.isError, router]);

  const createSite = useMutation({
    mutationFn: (payload: CreateCrawlSitePayload) => createCrawlSite(accessToken ?? "", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminCrawlSites() }),
  });
  const transitionSite = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending_review" | "active" | "suspended" }) =>
      updateCrawlSiteStatus(accessToken ?? "", id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminCrawlSites() }),
  });
  const triggerRun = useMutation({
    mutationFn: (id: string) => runCrawlSite(accessToken ?? "", id),
  });

  if (accessToken === null || me.isLoading) {
    return <DashboardLoading />;
  }

  if (me.isError || !me.data) {
    return null;
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    queryClient.removeQueries({ queryKey: queryKeys.adminMe() });
    router.replace("/admin/login");
  }

  function handleCreateSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const form = event.currentTarget;
    const payload = buildPayload(form, selectors);

    if (payload.entryUrls.length === 0) {
      setFormError("수집 시작 URL을 한 개 이상 입력해 주세요.");
      return;
    }

    createSite.mutate(payload, {
      onSuccess: () => {
        form.reset();
        setSelectors(emptySelectors);
      },
      onError: (error) => setFormError(errorMessage(error, "크롤링 사이트를 만들지 못했어요.")),
    });
  }

  const hasGenericPlugin = plugins.data?.plugins.some((plugin) => plugin.id === "generic-static-list") ?? false;
  const actionError = transitionSite.error ?? triggerRun.error;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--brand)]">JobCodi 관리자</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--text)]">수집 관리</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{me.data.admin.email}</p>
        </div>
        <Button onClick={handleLogout} variant="secondary">로그아웃</Button>
      </header>

      {actionError ? <p className="mt-5 rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]" role="alert">{errorMessage(actionError, "요청을 처리하지 못했어요.")}</p> : null}

      <section className="mt-8" aria-labelledby="sources-heading">
        <h2 className="text-lg font-semibold text-[var(--text)]" id="sources-heading">사용 중인 수집 소스</h2>
        {sources.isLoading ? <p className="mt-3 text-sm text-[var(--text-muted)]" role="status">수집 소스를 불러오는 중…</p> : null}
        {sources.isError ? <p className="mt-3 rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]" role="alert">{errorMessage(sources.error, "수집 소스를 불러오지 못했어요.")}</p> : null}
        {sources.data?.sources.length === 0 ? <p className="mt-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">등록된 수집 소스가 없어요.</p> : null}
        {sources.data && sources.data.sources.length > 0 ? (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.data.sources.map((source) => <li className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4" key={source.id}><p className="font-medium text-[var(--text)]">{source.displayName}</p><p className="mt-1 text-sm text-[var(--text-muted)]">{source.enabled ? "수집 중" : source.disabledReason ?? "비활성"}</p></li>)}
          </ul>
        ) : null}
      </section>

      <section className="mt-10" aria-labelledby="create-site-heading">
        <h2 className="text-lg font-semibold text-[var(--text)]" id="create-site-heading">크롤링 사이트 추가</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">범용 정적 공고 목록 플러그인용 CSS 선택자를 입력해 주세요. HTTPS 공개 URL만 사용할 수 있어요.</p>
        {plugins.isLoading ? <p className="mt-3 text-sm text-[var(--text-muted)]" role="status">플러그인을 확인하는 중…</p> : null}
        {plugins.isError ? <p className="mt-3 rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]" role="alert">{errorMessage(plugins.error, "플러그인을 불러오지 못했어요.")}</p> : null}
        <form className="mt-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6" onSubmit={handleCreateSite}>
          <fieldset disabled={createSite.isPending || !hasGenericPlugin}>
            <legend className="sr-only">크롤링 사이트 정보</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="표시 이름" name="displayName" required />
              <Field label="이용약관 URL" name="termsUrl" placeholder="https://example.com/terms" required type="url" />
              <Field label="수집 간격 (ms)" min={2000} name="minIntervalMs" required type="number" defaultValue="2000" />
              <Field label="최대 수집 건수" max={100} min={1} name="maxItems" required type="number" defaultValue="100" />
            </div>
            <label className="mt-4 block text-sm font-medium text-[var(--text)]" htmlFor="entryUrl">수집 시작 URL (줄바꿈으로 여러 개 입력)</label>
            <textarea className="mt-2 min-h-24 w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3 text-sm text-[var(--text)]" id="entryUrl" name="entryUrl" placeholder="https://careers.example.com/jobs" required />
            <h3 className="mt-6 text-sm font-semibold text-[var(--text)]">필수 CSS 선택자</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2"><SelectorField field="itemSelector" label="공고 항목" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="titleSelector" label="공고 제목" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="linkSelector" label="공고 링크" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="companySelector" label="회사명" selectors={selectors} setSelectors={setSelectors} /></div>
            <h3 className="mt-6 text-sm font-semibold text-[var(--text)]">선택 CSS 선택자</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2"><SelectorField field="regionSelector" label="지역" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="employmentTypeSelector" label="고용 형태" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="experienceSelector" label="경력" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="postedAtSelector" label="게시일" selectors={selectors} setSelectors={setSelectors} /><SelectorField field="closesAtSelector" label="마감일" selectors={selectors} setSelectors={setSelectors} /></div>
            {!hasGenericPlugin && plugins.isSuccess ? <p className="mt-4 text-sm text-[var(--danger)]" role="alert">범용 정적 공고 목록 플러그인을 사용할 수 없어요.</p> : null}
            {formError ? <p className="mt-4 rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]" role="alert">{formError}</p> : null}
            <Button className="mt-6" type="submit">{createSite.isPending ? "추가 중…" : "사이트 추가"}</Button>
          </fieldset>
        </form>
      </section>

      <section className="mt-10" aria-labelledby="crawl-sites-heading">
        <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-semibold text-[var(--text)]" id="crawl-sites-heading">등록된 크롤링 사이트</h2><Button disabled={crawlSites.isFetching} onClick={() => crawlSites.refetch()} size="sm" variant="secondary">새로고침</Button></div>
        {crawlSites.isLoading ? <p className="mt-3 text-sm text-[var(--text-muted)]" role="status">크롤링 사이트를 불러오는 중…</p> : null}
        {crawlSites.isError ? <p className="mt-3 rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]" role="alert">{errorMessage(crawlSites.error, "크롤링 사이트를 불러오지 못했어요.")}</p> : null}
        {crawlSites.data?.crawlSites.length === 0 ? <p className="mt-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">등록된 크롤링 사이트가 없어요. 위 양식으로 첫 사이트를 추가해 주세요.</p> : null}
        {crawlSites.data && crawlSites.data.crawlSites.length > 0 ? <ul className="mt-3 grid gap-3">{crawlSites.data.crawlSites.map((site) => <CrawlSiteCard key={site.id} onRun={() => triggerRun.mutate(site.id)} onTransition={(status) => transitionSite.mutate({ id: site.id, status })} runPending={triggerRun.isPending} site={site} transitionPending={transitionSite.isPending} />)}</ul> : null}
      </section>
    </main>
  );
}

interface FieldProps extends React.ComponentProps<typeof Input> { label: string; name: string; }
function Field({ label, name, ...props }: FieldProps) { return <div><label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor={name}>{label}</label><Input id={name} name={name} {...props} /></div>; }

interface SelectorFieldProps { field: keyof SelectorFields; label: string; selectors: SelectorFields; setSelectors: (value: SelectorFields) => void; }
function SelectorField({ field, label, selectors, setSelectors }: SelectorFieldProps) { return <div><label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor={field}>{label}</label><Input id={field} onChange={(event) => setSelectors({ ...selectors, [field]: event.target.value })} required={["itemSelector", "titleSelector", "linkSelector", "companySelector"].includes(field)} value={selectors[field]} /></div>; }

interface CrawlSiteCardProps { site: CrawlSite; transitionPending: boolean; runPending: boolean; onTransition: (status: "pending_review" | "active" | "suspended") => void; onRun: () => void; }
function CrawlSiteCard({ site, transitionPending, runPending, onTransition, onRun }: CrawlSiteCardProps) { const action = nextStatusAction(site.status); return <li className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-medium text-[var(--text)]">{site.displayName}</p><p className="mt-1 break-all text-sm text-[var(--text-muted)]">{site.sourceId} · {site.pluginId}</p><p className="mt-2 text-sm text-[var(--text-muted)]">상태: <span className="font-medium text-[var(--text)]">{statusLabels[site.status]}</span></p></div><div className="flex flex-wrap gap-2">{action ? <Button disabled={transitionPending} onClick={() => onTransition(action.status)} size="sm" variant={action.status === "suspended" ? "danger" : "secondary"}>{action.label}</Button> : null}{site.status === "active" ? <Button disabled={runPending} onClick={onRun} size="sm">{runPending ? "실행 요청 중…" : "수동 실행"}</Button> : null}</div></div></li>; }
