import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

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
    <nav aria-label="진행 단계" className="border-b border-gray-100 bg-white">
      <ol className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-4">
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
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  state === "current" &&
                    "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200",
                  state === "done" &&
                    "bg-emerald-500 text-white",
                  state === "upcoming" &&
                    "border-2 border-gray-200 bg-white text-gray-400",
                )}
              >
                {state === "done" ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  step.index
                )}
              </span>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  state === "current" && "text-indigo-600",
                  state === "done" && "text-emerald-600",
                  state === "upcoming" && "text-gray-400",
                )}
              >
                {step.label}
              </span>
              {step.index < FLOW_STEPS.length ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-2 h-0.5 w-8 shrink-0 rounded-full transition-colors",
                    state === "done" ? "bg-emerald-200" : "bg-gray-100"
                  )}
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
