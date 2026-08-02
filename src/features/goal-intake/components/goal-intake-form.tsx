"use client";

import { useRouter } from "next/navigation";
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
      <div>
        <h1 className="text-[22px] font-semibold leading-[30px] text-[var(--text)]">
          어떤 곳을 목표로 하고 계세요?
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          필수 항목만 채우면 30초 안에 시작할 수 있어요.
        </p>
      </div>

      <ExistingSessionNotice />

      {taxonomyFailed ? (
        <p role="alert" className="rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
          선택지를 불러오지 못했어요. 새로고침을 시도해 주세요.
        </p>
      ) : null}

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

      {createSession.isError ? (
        <p role="alert" className="rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
          시작하지 못했어요. {createSession.error.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
        >
          {createSession.isPending ? "시작하는 중..." : "AI와 대화 시작하기 →"}
        </Button>
      </div>
      {!canSubmit && !createSession.isPending ? (
        <p className="text-right text-xs text-[var(--text-subtle)]" aria-live="polite">
          기업 규모, 직군, 경력 구분을 선택하면 시작할 수 있어요.
        </p>
      ) : null}
    </form>
  );
}
