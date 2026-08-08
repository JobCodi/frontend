import { Check } from "lucide-react";
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
  const progress =
    FLOW_STEPS.length <= 1
      ? 0
      : ((Math.min(Math.max(currentStep, 1), FLOW_STEPS.length) - 1) / (FLOW_STEPS.length - 1)) * 100;

  return (
    <nav
      aria-label="진행 단계"
      className="border-b border-[var(--line)]/70 bg-white/75 backdrop-blur-xl"
    >
      <div className="mx-auto w-full max-w-[var(--content-standard)] px-[var(--page-space-x)] py-4">
        <div className="rounded-2xl border border-[var(--line)]/80 bg-white/90 px-3 py-3 shadow-[var(--shadow-card)] sm:px-5 sm:py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                JobCodi Flow
              </p>
              <p className="mt-0.5 text-sm font-medium text-[var(--text)]">
                {active ? `${active.index}단계 · ${active.label}` : "탐색 진행 중"}
              </p>
            </div>
            <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-strong)]">
              {Math.min(Math.max(currentStep, 1), FLOW_STEPS.length)}/{FLOW_STEPS.length}
            </span>
          </div>

          <ol className="relative flex items-center justify-between gap-2">
            <span
              aria-hidden="true"
              className="absolute left-4 right-4 top-3 h-0.5 -translate-y-1/2 rounded-full bg-[var(--line)] sm:left-8 sm:right-8"
            />
            <span
              aria-hidden="true"
              className="absolute left-4 top-3 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--brand)] to-[#7c3aed] transition-all duration-300 sm:left-8"
              style={{ width: `calc(${progress}% - 1rem)` }}
            />

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
                  className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all",
                      state === "current" &&
                        "bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.28)] ring-4 ring-[var(--brand-soft)]",
                      state === "done" && "bg-[var(--match)] text-white shadow-sm",
                      state === "upcoming" &&
                        "border border-[var(--line)] bg-white text-[var(--text-subtle)]",
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
                      "max-w-full truncate text-center text-[11px] font-medium sm:text-sm",
                      state === "current" && "text-[var(--brand)]",
                      state === "done" && "text-[var(--match)]",
                      state === "upcoming" && "text-[var(--text-subtle)]",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <span className="sr-only" role="status">
        {active ? `${active.index}단계 중 ${active.label} 진행 중` : ""}
      </span>
    </nav>
  );
}
