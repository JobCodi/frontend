"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TARGET_START_AT_OPTIONS, type Taxonomy } from "@/lib/schemas/taxonomy";
import { useGoalIntakeStore } from "../stores/goal-intake-store";
import { useCreateSession } from "../queries/use-create-session";
import { isGoalInputSubmittable } from "../types";
import { GoalFieldSection } from "./goal-field-section";
import { ExistingSessionNotice } from "./existing-session-notice";

interface GoalIntakeFormProps {
  taxonomy: Taxonomy;
  taxonomyFailed?: boolean;
}

const TIPS = [
  {
    title: "필수 3가지만 채우면 시작",
    body: "기업 규모 · 직군 · 경력만 선택해도 AI 대화를 바로 시작할 수 있어요.",
  },
  {
    title: "조건은 나중에 고쳐도 돼요",
    body: "대화 후 조건 확인 단계에서 언제든 세부 조건을 수정할 수 있어요.",
  },
  {
    title: "공고 본문은 저장하지 않아요",
    body: "매칭 근거와 원문 링크만 제공해, 최신 공고는 원문에서 확인해요.",
  },
];

export function GoalIntakeForm({ taxonomy, taxonomyFailed = false }: GoalIntakeFormProps) {
  const router = useRouter();
  const { goal, setField, toggleInArray } = useGoalIntakeStore();
  const createSession = useCreateSession();

  const selectedFamily = taxonomy.jobFamilies.find((f) => f.code === goal.jobFamily);
  const canSubmit = isGoalInputSubmittable(goal) && !createSession.isPending;

  const requiredDone = [
    goal.companySizes.length > 0,
    Boolean(goal.jobFamily),
    Boolean(goal.experienceLevel),
  ].filter(Boolean).length;

  function handleFamilyChange(value: string) {
    setField("jobFamily", value === goal.jobFamily ? "" : value);
    setField("roles", []);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isGoalInputSubmittable(goal)) return;
    createSession.mutate(goal, {
      onSuccess: (session) => {
        router.push(`/discovery/${session.sessionId}`);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-5">
          <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-elevated)]">
            <div className="relative border-b border-[var(--line)] bg-gradient-to-br from-white via-[var(--brand-soft)]/40 to-[#f3e8ff]/50 px-5 py-6 sm:px-7 sm:py-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(84,69,244,0.18),transparent_70%)]"
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.28)]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                      Step 1 · Goal
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[28px] sm:leading-9">
                      어떤 곳을 목표로 하고 계세요?
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
                      필수 항목만 채우면 30초 안에 AI 대화를 시작할 수 있어요. 세부 조건은 이후 단계에서
                      다듬을 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:min-w-[148px]">
                  <p className="text-xs font-medium text-[var(--text-subtle)]">필수 항목</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                    <span className="text-[var(--brand)]">{requiredDone}</span>
                    <span className="text-[var(--text-subtle)]"> / 3</span>
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[#7c3aed] transition-all"
                      style={{ width: `${(requiredDone / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
              <ExistingSessionNotice />

              {taxonomyFailed ? (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  선택지를 불러오지 못했어요. 새로고침을 시도해 주세요.
                </p>
              ) : null}

              <div className="grid gap-4">
                <GoalFieldSection
                  label="기업 규모"
                  required
                  hint="복수 선택"
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  options={taxonomy.companySizes}
                  mode="multiple"
                  selected={goal.companySizes}
                  onToggle={(value) => toggleInArray("companySizes", value)}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <GoalFieldSection
                    label="직군"
                    required
                    icon={<Briefcase className="h-3.5 w-3.5" />}
                    options={taxonomy.jobFamilies.map((f) => ({ code: f.code, label: f.label }))}
                    mode="single"
                    selected={goal.jobFamily ? [goal.jobFamily] : []}
                    onToggle={handleFamilyChange}
                  />
                  <GoalFieldSection
                    label="경력 구분"
                    required
                    icon={<UserRound className="h-3.5 w-3.5" />}
                    options={taxonomy.experienceLevels}
                    mode="single"
                    selected={goal.experienceLevel ? [goal.experienceLevel] : []}
                    onToggle={(value) =>
                      setField("experienceLevel", value === goal.experienceLevel ? "" : value)
                    }
                  />
                </div>

                {selectedFamily && selectedFamily.roles.length > 0 ? (
                  <GoalFieldSection
                    label="세부 직무"
                    hint="복수 선택"
                    icon={<Briefcase className="h-3.5 w-3.5" />}
                    options={selectedFamily.roles}
                    mode="multiple"
                    selected={goal.roles}
                    onToggle={(value) => toggleInArray("roles", value)}
                  />
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <GoalFieldSection
                    label="희망 지역"
                    hint="복수 선택"
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    options={taxonomy.regions}
                    mode="multiple"
                    selected={goal.regions}
                    onToggle={(value) => toggleInArray("regions", value)}
                  />
                  <GoalFieldSection
                    label="고용 형태"
                    hint="복수 선택"
                    icon={<Briefcase className="h-3.5 w-3.5" />}
                    options={taxonomy.employmentTypes}
                    mode="multiple"
                    selected={goal.employmentTypes}
                    onToggle={(value) => toggleInArray("employmentTypes", value)}
                  />
                </div>

                <GoalFieldSection
                  label="언제부터 일하고 싶으세요?"
                  icon={<CalendarClock className="h-3.5 w-3.5" />}
                  options={TARGET_START_AT_OPTIONS}
                  mode="single"
                  selected={goal.targetStartAt ? [goal.targetStartAt] : []}
                  onToggle={(value) =>
                    setField("targetStartAt", value === goal.targetStartAt ? null : value)
                  }
                />
              </div>

              {createSession.isError ? (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  시작하지 못했어요. {createSession.error.message}
                </p>
              ) : null}
            </div>

            <div className="sticky bottom-0 z-20 border-t border-[var(--line)] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--text-muted)]" aria-live="polite">
                  {canSubmit || createSession.isPending
                    ? "준비가 됐어요. AI가 조건을 더 정교하게 물어볼게요."
                    : "기업 규모, 직군, 경력 구분을 선택하면 시작할 수 있어요."}
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit}
                  aria-disabled={!canSubmit}
                  className="rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] px-7 text-white shadow-lg shadow-[rgba(84,69,244,0.28)] hover:brightness-105 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
                >
                  {createSession.isPending ? (
                    "시작하는 중..."
                  ) : (
                    <>
                      AI와 대화 시작하기
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
              How it works
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">탐색은 이렇게 진행돼요</h2>
            <ol className="mt-4 space-y-3">
              {[
                "목표 입력",
                "AI 5턴 대화",
                "조건 확인·수정",
                "맞춤 공고 피드",
              ].map((item, index) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[var(--text)]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand-strong)]">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-b from-white to-[var(--surface-soft)] p-5 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold text-[var(--text)]">알아두면 좋아요</p>
            <ul className="mt-4 space-y-4">
              {TIPS.map((tip) => (
                <li key={tip.title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--match)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{tip.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{tip.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </form>
  );
}
