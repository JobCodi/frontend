import { ChipGroup, ChoiceChip } from "@/components/ui/choice-chip";
import { TypingIndicator } from "@/components/feedback/typing-indicator";
import { MessageCircle } from "lucide-react";
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
    <div aria-live="polite" className="flex flex-col gap-6">
      {turn ? (
        <div key={turn.index} className="flex flex-col gap-5">
          {/* Question card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-[22px] font-semibold leading-relaxed text-gray-900">
                  {turn.question}
                </p>
              </div>
            </div>
          </div>

          {/* Choices */}
          {turn.choices.length > 0 ? (
            <div className="rounded-xl border border-gray-50 bg-gray-50/50 p-4">
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

          {/* Free text input */}
          {turn.allowsFreeText ? (
            <FreeTextInput disabled={isSubmitting} onSubmit={onSubmitFreeText} />
          ) : null}
        </div>
      ) : isSubmitting ? (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
            <MessageCircle className="h-5 w-5" />
          </div>
          <TypingIndicator showSlowHint={showSlowHint} />
        </div>
      ) : null}
    </div>
  );
}
