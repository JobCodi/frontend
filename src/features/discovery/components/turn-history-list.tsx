import { Check, MessageCircle } from "lucide-react";
import type { AnsweredTurn } from "@/lib/schemas/session";

interface TurnHistoryListProps {
  turns: AnsweredTurn[];
}

export function TurnHistoryList({ turns }: TurnHistoryListProps) {
  if (turns.length === 0) return null;

  const reversed = [...turns].reverse();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-medium text-[var(--text-subtle)]">
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        이전 대화
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
      </div>
      <ul className="flex flex-col gap-3">
        {reversed.map((entry) => (
          <li
            key={entry.index}
            className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/40 p-4 shadow-sm"
          >
            <div className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                  턴 {entry.index}
                </span>
                <p className="mt-0.5 leading-6">{entry.question}</p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2.5 border-t border-[var(--line)]/70 pt-3 text-[15px] text-[var(--text)]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--match-soft)] text-[var(--match)]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="flex-1 font-medium leading-6">{entry.answer}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
