import { cn } from "@/lib/utils/cn";

export interface FlowStep {
  index: number;
  label: string;
}

export const FLOW_STEPS: FlowStep[] = [
  { index: 1, label: "목표 입력" },
  { index: 2, label: "AI 대화" },
  { index: 3, label: "조건 확인" },
  { index: 4, label: "공고 모아보기" },
];

interface StepProgressProps {
  currentStep: number;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const active = FLOW_STEPS.find((step) => step.index === currentStep);

  return (
    <nav aria-label="진행 단계" className="border-b border-[var(--line)] bg-[var(--surface)]">
      <ol className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-3">
        {FLOW_STEPS.map((step) => {
          const state =
            step.index === currentStep
              ? "current"
              : step.index < currentStep
                ? "done"
                : "upcoming";
          return (
            <li
              key={step.index}
              aria-current={state === "current" ? "step" : undefined}
              className="flex shrink-0 items-center gap-2"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold",
                  state === "current" &&
                    "border-[var(--brand)] bg-[var(--brand)] text-white",
                  state === "done" &&
                    "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand-strong)]",
                  state === "upcoming" &&
                    "border-[var(--line)] bg-[var(--surface)] text-[var(--text-subtle)]",
                )}
              >
                {step.index}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  state === "upcoming" ? "text-[var(--text-subtle)]" : "text-[var(--text)]",
                )}
              >
                {step.label}
              </span>
              {step.index < FLOW_STEPS.length ? (
                <span
                  aria-hidden="true"
                  className="mx-1 h-px w-4 shrink-0 bg-[var(--line)] sm:w-6"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <span className="sr-only" role="status">
        {active ? `${active.index}단계 중 ${active.label} 진행 중` : ""}
      </span>
    </nav>
  );
}
