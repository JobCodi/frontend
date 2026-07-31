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
        <div key={turn.turnIndex} className="message-in flex flex-col gap-4">
          <p className="flex items-start gap-2 text-[22px] font-semibold leading-[30px] text-[var(--text)]">
            <span aria-hidden="true">🤖</span>
            <span>{turn.prompt}</span>
          </p>

          {turn.choices.length > 0 ? (
            <ChipGroup label={turn.prompt} multiple={false}>
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
          ) : null}

          {turn.allowFreeText ? (
            <FreeTextInput disabled={isSubmitting} onSubmit={onSubmitFreeText} />
          ) : null}
        </div>
      ) : isSubmitting ? (
        <div className="flex items-center gap-2" aria-label="AI가 다음 질문을 준비하고 있어요">
          <span aria-hidden="true">🤖</span>
          <TypingIndicator showSlowHint={showSlowHint} />
        </div>
      ) : null}
    </div>
  );
}
