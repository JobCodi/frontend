"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TARGET_START_AT_OPTIONS, type Taxonomy } from "@/lib/schemas/taxonomy";
import { useGoalIntakeStore } from "../stores/goal-intake-store";
import { useCreateSession } from "../queries/use-create-session";
import { isGoalInputSubmittable } from "../types";
import { GoalFieldSection } from "./goal-field-section";
import { ExistingSessionNotice } from "./existing-session-notice";
import { Sparkles, ArrowRight } from "lucide-react";

interface GoalIntakeFormProps {
  taxonomy: Taxonomy;
  taxonomyFailed?: boolean;
}

export function GoalIntakeForm({ taxonomy, taxonomyFailed = false }: GoalIntakeFormProps) {
  const router = useRouter();
  const { goal, setField, toggleInArray } = useGoalIntakeStore();
  const createSession = useCreateSession();

  const selectedFamily = taxonomy.jobFamilies.find((f) => f.code === goal.jobFamily);
  const canSubmit = isGoalInputSubmittable(goal) && !createSession.isPending;

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
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold leading-[30px] text-gray-900">
              어떤 곳을 목표로 하고 계세요?
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              필수 항목만 채우면 30초 안에 시작할 수 있어요.
            </p>
          </div>
        </div>
      </div>

      <ExistingSessionNotice />

      {taxonomyFailed ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          선택지를 불러오지 못했어요. 새로고침을 시도해 주세요.
        </p>
      ) : null}

      {/* Form fields */}
      <div className="flex flex-col gap-6">
        <GoalFieldSection
          label="기업 규모"
          required
          hint="복수 선택"
          options={taxonomy.companySizes}
          mode="multiple"
          selected={goal.companySizes}
          onToggle={(value) => toggleInArray("companySizes", value)}
        />

        <GoalFieldSection
          label="직군"
          required
          options={taxonomy.jobFamilies.map((f) => ({ code: f.code, label: f.label }))}
          mode="single"
          selected={goal.jobFamily ? [goal.jobFamily] : []}
          onToggle={handleFamilyChange}
        />

        {selectedFamily && selectedFamily.roles.length > 0 ? (
          <GoalFieldSection
            label="세부 직무"
            hint="복수 선택"
            options={selectedFamily.roles}
            mode="multiple"
            selected={goal.roles}
            onToggle={(value) => toggleInArray("roles", value)}
          />
        ) : null}

        <GoalFieldSection
          label="경력 구분"
          required
          options={taxonomy.experienceLevels}
          mode="single"
          selected={goal.experienceLevel ? [goal.experienceLevel] : []}
          onToggle={(value) =>
            setField("experienceLevel", value === goal.experienceLevel ? "" : value)
          }
        />

        <GoalFieldSection
          label="희망 지역"
          hint="복수 선택"
          options={taxonomy.regions}
          mode="multiple"
          selected={goal.regions}
          onToggle={(value) => toggleInArray("regions", value)}
        />

        <GoalFieldSection
          label="고용 형태"
          hint="복수 선택"
          options={taxonomy.employmentTypes}
          mode="multiple"
          selected={goal.employmentTypes}
          onToggle={(value) => toggleInArray("employmentTypes", value)}
        />

        <GoalFieldSection
          label="언제부터 일하고 싶으세요?"
          options={TARGET_START_AT_OPTIONS}
          mode="single"
          selected={goal.targetStartAt ? [goal.targetStartAt] : []}
          onToggle={(value) =>
            setField("targetStartAt", value === goal.targetStartAt ? null : value)
          }
        />
      </div>

      {createSession.isError ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          시작하지 못했어요. {createSession.error.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 px-8 text-white shadow-lg shadow-indigo-200 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
        >
          {createSession.isPending ? "시작하는 중..." : (
            <>
              AI와 대화 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {!canSubmit && !createSession.isPending ? (
        <p className="text-right text-xs text-gray-400" aria-live="polite">
          기업 규모, 직군, 경력 구분을 선택하면 시작할 수 있어요.
        </p>
      ) : null}
    </form>
  );
}
