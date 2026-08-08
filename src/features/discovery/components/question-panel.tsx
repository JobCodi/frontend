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
        <div key={turn.index} className="flex flex-col gap-5">
          <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[var(--shadow-card)] transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-soft)]/40 via-transparent to-[#f3e8ff]/30" aria-hidden="true" />
            <div className="relative p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.3)]">
                  <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--brand)]">
                      질문 {turn.index}
                    </span>
                  </div>
                  <p className="ui-section-title mt-2 leading-relaxed">
                    {turn.question}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {turn.choices.length > 0 ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                선택지를 고르세요
              </p>
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
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                또는 직접 입력
              </p>
              <FreeTextInput disabled={isSubmitting} onSubmit={onSubmitFreeText} />
            </div>
          ) : null}
        </div>
      ) : isSubmitting ? (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-soft)]/30 via-transparent to-[#f3e8ff]/20" aria-hidden="true" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.3)]">
              <MessageCircle className="h-5 w-5 animate-pulse" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-muted)]">AI가 다음 질문을 준비하고 있어요</p>
              <TypingIndicator showSlowHint={showSlowHint} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
