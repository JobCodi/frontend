import { MessageCircle } from "lucide-react";
import { ChipGroup, ChoiceChip } from "@/components/ui/choice-chip";
import { TypingIndicator } from "@/components/feedback/typing-indicator";
import type { TurnQuestion } from "@/lib/schemas/session";
import { FreeTextInput } from "./free-text-input";

interface QuestionPanelProps {
  turn: TurnQuestion | null;
  isSubmitting: boolean;
  showSlowHint: boolean;
  onSelectChoice: (value: string) => void;
  onSubmitFreeText: (text: string) => void;
}

/**
 * The active (unanswered) turn. Lives inside an aria-live="polite" region
 * so a new question is announced to screen readers (product.md §7).
 */
export function QuestionPanel({
  turn,
  isSubmitting,
  showSlowHint,
  onSelectChoice,
  onSubmitFreeText,
}: QuestionPanelProps) {
  return (
    <div aria-live="polite" className="flex flex-col gap-4">
      {turn ? (
        <div key={turn.index} className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--line)] bg-gradient-to-br from-white to-[var(--surface-soft)] p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.25)]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                  Question {turn.index}
                </p>
                <p className="mt-1 text-xl font-semibold leading-relaxed text-[var(--text)] sm:text-[22px]">
                  {turn.question}
                </p>
              </div>
            </div>
          </div>

          {turn.choices.length > 0 ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:p-5">
              <p className="mb-3 text-xs font-medium text-[var(--text-subtle)]">선택지</p>
              <ChipGroup label={turn.question} multiple={false}>
                {turn.choices.map((choice) => (
                  <ChoiceChip
                    key={choice.value}
                    role="radio"
                    disabled={isSubmitting}
                    onClick={() => onSelectChoice(choice.value)}
                  >
                    {choice.label}
                  </ChoiceChip>
                ))}
              </ChipGroup>
            </div>
          ) : null}

          {turn.allowsFreeText ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-medium text-[var(--text-subtle)]">직접 입력</p>
              <FreeTextInput disabled={isSubmitting} onSubmit={onSubmitFreeText} />
            </div>
          ) : null}
        </div>
      ) : isSubmitting ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.25)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <TypingIndicator showSlowHint={showSlowHint} />
        </div>
      ) : null}
    </div>
  );
}
