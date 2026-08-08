"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Database,
  Globe2,
  LogOut,
  Plus,
  RefreshCw,
  Shield,
} from "lucide-react";
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
import { cn } from "@/lib/utils/cn";

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

const statusStyles: Record<CrawlSiteStatus, string> = {
  draft: "bg-[var(--surface-soft)] text-[var(--text-muted)] ring-[var(--line)]",
  pending_review: "bg-amber-50 text-amber-700 ring-amber-100",
  active: "bg-[var(--match-soft)] text-[var(--match)] ring-emerald-100",
  suspended: "bg-red-50 text-red-700 ring-red-100",
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

function nextStatusAction(
  status: CrawlSiteStatus,
): { status: "pending_review" | "active" | "suspended"; label: string } | null {
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
    <main className="ui-page ui-page-wide relative" role="status">
      <div className="rounded-3xl border border-[var(--line)] bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-sm text-[var(--text-muted)]">관리자 정보를 확인하는 중…</p>
      </div>
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
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending_review" | "active" | "suspended";
    }) => updateCrawlSiteStatus(accessToken ?? "", id, status),
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

  const hasGenericPlugin =
    plugins.data?.plugins.some((plugin) => plugin.id === "generic-static-list") ?? false;
  const actionError = transitionSite.error ?? triggerRun.error;
  const sourceCount = sources.data?.sources.length ?? 0;
  const siteCount = crawlSites.data?.crawlSites.length ?? 0;
  const activeCount =
    crawlSites.data?.crawlSites.filter((site) => site.status === "active").length ?? 0;

  return (
    <main className="ui-page ui-page-wide relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="app-grid absolute inset-0 opacity-40" />
        <div className="absolute left-1/2 top-0 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(84,69,244,0.12),transparent_70%)] blur-2xl" />
      </div>

      <header className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-elevated)]">
        <div className="flex flex-col gap-5 border-b border-[var(--line)] bg-gradient-to-br from-white via-[var(--brand-soft)]/35 to-[#f3e8ff]/40 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                JobCodi Admin
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
                수집 관리
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{me.data.admin.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="gap-2 rounded-xl border-[var(--line)] bg-white shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3 sm:px-7">
          <StatCard icon={<Database className="h-4 w-4" />} label="수집 소스" value={sourceCount} />
          <StatCard icon={<Globe2 className="h-4 w-4" />} label="크롤링 사이트" value={siteCount} />
          <StatCard icon={<RefreshCw className="h-4 w-4" />} label="활성 사이트" value={activeCount} />
        </div>
      </header>

      {actionError ? (
        <p
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {errorMessage(actionError, "요청을 처리하지 못했어요.")}
        </p>
      ) : null}

      <section className="mt-6 overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-card)]" aria-labelledby="sources-heading">
        <div className="border-b border-[var(--line)] px-5 py-5 sm:px-7">
          <h2 className="ui-section-title" id="sources-heading">
            사용 중인 수집 소스
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">현재 파이프라인에 연결된 소스 상태입니다.</p>
        </div>
        <div className="p-5 sm:p-7">
          {sources.isLoading ? (
            <p className="text-sm text-[var(--text-muted)]" role="status">
              수집 소스를 불러오는 중…
            </p>
          ) : null}
          {sources.isError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {errorMessage(sources.error, "수집 소스를 불러오지 못했어요.")}
            </p>
          ) : null}
          {sources.data?.sources.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-soft)] p-6 text-sm text-[var(--text-muted)]">
              등록된 수집 소스가 없어요.
            </p>
          ) : null}
          {sources.data && sources.data.sources.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sources.data.sources.map((source) => (
                <li
                  key={source.id}
                  className="rounded-2xl border border-[var(--line)] bg-gradient-to-b from-white to-[var(--surface-soft)]/60 p-4 shadow-sm"
                >
                  <p className="font-semibold text-[var(--text)]">{source.displayName}</p>
                  <p className="mt-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        source.enabled
                          ? "bg-[var(--match-soft)] text-[var(--match)] ring-emerald-100"
                          : "bg-[var(--surface-soft)] text-[var(--text-muted)] ring-[var(--line)]",
                      )}
                    >
                      {source.enabled ? "수집 중" : source.disabledReason ?? "비활성"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-card)]" aria-labelledby="create-site-heading">
        <div className="border-b border-[var(--line)] bg-gradient-to-r from-white to-[var(--brand-soft)]/20 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]" id="create-site-heading">
                크롤링 사이트 추가
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                범용 정적 공고 목록 플러그인용 CSS 선택자를 입력해 주세요. HTTPS 공개 URL만 사용할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          {plugins.isLoading ? (
            <p className="mb-4 text-sm text-[var(--text-muted)]" role="status">
              플러그인을 확인하는 중…
            </p>
          ) : null}
          {plugins.isError ? (
            <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {errorMessage(plugins.error, "플러그인을 불러오지 못했어요.")}
            </p>
          ) : null}

          <form className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/40 p-4 sm:p-6" onSubmit={handleCreateSite}>
            <fieldset disabled={createSite.isPending || !hasGenericPlugin}>
              <legend className="sr-only">크롤링 사이트 정보</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="표시 이름" name="displayName" required />
                <Field
                  label="이용약관 URL"
                  name="termsUrl"
                  placeholder="https://example.com/terms"
                  required
                  type="url"
                />
                <Field
                  label="수집 간격 (ms)"
                  min={2000}
                  name="minIntervalMs"
                  required
                  type="number"
                  defaultValue="2000"
                />
                <Field
                  label="최대 수집 건수"
                  max={100}
                  min={1}
                  name="maxItems"
                  required
                  type="number"
                  defaultValue="100"
                />
              </div>
              <label className="mt-4 block text-sm font-medium text-[var(--text)]" htmlFor="entryUrl">
                수집 시작 URL (줄바꿈으로 여러 개 입력)
              </label>
              <textarea
                className="mt-2 min-h-24 w-full rounded-xl border border-[var(--line)] bg-white p-3 text-sm text-[var(--text)] shadow-sm"
                id="entryUrl"
                name="entryUrl"
                placeholder="https://careers.example.com/jobs"
                required
              />
              <h3 className="mt-6 text-sm font-semibold text-[var(--text)]">필수 CSS 선택자</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <SelectorField field="itemSelector" label="공고 항목" selectors={selectors} setSelectors={setSelectors} />
                <SelectorField field="titleSelector" label="공고 제목" selectors={selectors} setSelectors={setSelectors} />
                <SelectorField field="linkSelector" label="공고 링크" selectors={selectors} setSelectors={setSelectors} />
                <SelectorField field="companySelector" label="회사명" selectors={selectors} setSelectors={setSelectors} />
              </div>
              <h3 className="mt-6 text-sm font-semibold text-[var(--text)]">선택 CSS 선택자</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <SelectorField field="regionSelector" label="지역" selectors={selectors} setSelectors={setSelectors} />
                <SelectorField
                  field="employmentTypeSelector"
                  label="고용 형태"
                  selectors={selectors}
                  setSelectors={setSelectors}
                />
                <SelectorField field="experienceSelector" label="경력" selectors={selectors} setSelectors={setSelectors} />
                <SelectorField field="postedAtSelector" label="게시일" selectors={selectors} setSelectors={setSelectors} />
                <SelectorField field="closesAtSelector" label="마감일" selectors={selectors} setSelectors={setSelectors} />
              </div>
              {!hasGenericPlugin && plugins.isSuccess ? (
                <p className="mt-4 text-sm text-red-700" role="alert">
                  범용 정적 공고 목록 플러그인을 사용할 수 없어요.
                </p>
              ) : null}
              {formError ? (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {formError}
                </p>
              ) : null}
              <Button
                className="mt-6 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]"
                type="submit"
              >
                {createSite.isPending ? "추가 중…" : "사이트 추가"}
              </Button>
            </fieldset>
          </form>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-card)]" aria-labelledby="crawl-sites-heading">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]" id="crawl-sites-heading">
              등록된 크롤링 사이트
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">승인 상태와 수동 실행을 관리합니다.</p>
          </div>
          <Button
            disabled={crawlSites.isFetching}
            onClick={() => crawlSites.refetch()}
            size="sm"
            variant="secondary"
            className="gap-2 rounded-xl"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", crawlSites.isFetching && "animate-spin")} />
            새로고침
          </Button>
        </div>
        <div className="p-5 sm:p-7">
          {crawlSites.isLoading ? (
            <p className="text-sm text-[var(--text-muted)]" role="status">
              크롤링 사이트를 불러오는 중…
            </p>
          ) : null}
          {crawlSites.isError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {errorMessage(crawlSites.error, "크롤링 사이트를 불러오지 못했어요.")}
            </p>
          ) : null}
          {crawlSites.data?.crawlSites.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-soft)] p-6 text-sm text-[var(--text-muted)]">
              등록된 크롤링 사이트가 없어요. 위 양식으로 첫 사이트를 추가해 주세요.
            </p>
          ) : null}
          {crawlSites.data && crawlSites.data.crawlSites.length > 0 ? (
            <ul className="grid gap-3">
              {crawlSites.data.crawlSites.map((site) => (
                <CrawlSiteCard
                  key={site.id}
                  onRun={() => triggerRun.mutate(site.id)}
                  onTransition={(status) => transitionSite.mutate({ id: site.id, status })}
                  runPending={triggerRun.isPending}
                  site={site}
                  transitionPending={transitionSite.isPending}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-gradient-to-b from-white to-[var(--surface-soft)]/70 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-subtle)]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
          {icon}
        </span>
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}

interface FieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  name: string;
}
function Field({ label, name, className, ...props }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor={name}>
        {label}
      </label>
      <Input id={name} name={name} className={cn("rounded-xl bg-white", className)} {...props} />
    </div>
  );
}

interface SelectorFieldProps {
  field: keyof SelectorFields;
  label: string;
  selectors: SelectorFields;
  setSelectors: (value: SelectorFields) => void;
}
function SelectorField({ field, label, selectors, setSelectors }: SelectorFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor={field}>
        {label}
      </label>
      <Input
        id={field}
        className="rounded-xl bg-white"
        onChange={(event) => setSelectors({ ...selectors, [field]: event.target.value })}
        required={["itemSelector", "titleSelector", "linkSelector", "companySelector"].includes(field)}
        value={selectors[field]}
      />
    </div>
  );
}

interface CrawlSiteCardProps {
  site: CrawlSite;
  transitionPending: boolean;
  runPending: boolean;
  onTransition: (status: "pending_review" | "active" | "suspended") => void;
  onRun: () => void;
}
function CrawlSiteCard({
  site,
  transitionPending,
  runPending,
  onTransition,
  onRun,
}: CrawlSiteCardProps) {
  const action = nextStatusAction(site.status);
  return (
    <li className="rounded-2xl border border-[var(--line)] bg-gradient-to-b from-white to-[var(--surface-soft)]/50 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[var(--text)]">{site.displayName}</p>
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                statusStyles[site.status],
              )}
            >
              {statusLabels[site.status]}
            </span>
          </div>
          <p className="mt-1 break-all text-sm text-[var(--text-muted)]">
            {site.sourceId} · {site.pluginId}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {action ? (
            <Button
              disabled={transitionPending}
              onClick={() => onTransition(action.status)}
              size="sm"
              variant={action.status === "suspended" ? "danger" : "secondary"}
              className="rounded-lg"
            >
              {action.label}
            </Button>
          ) : null}
          {site.status === "active" ? (
            <Button disabled={runPending} onClick={onRun} size="sm" className="rounded-lg">
              {runPending ? "실행 요청 중…" : "수동 실행"}
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
}
