import { Check, MessageCircle } from "lucide-react";
import type { AnsweredTurn } from "@/lib/schemas/session";

interface TurnHistoryListProps {
  turns: AnsweredTurn[];
}

export function TurnHistoryList({ turns }: TurnHistoryListProps) {
  if (turns.length === 0) return null;

  const reversed = [...turns].reverse();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
          완료된 대화
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" aria-hidden="true" />
      </div>
      <ul className="flex flex-col gap-3">
        {reversed.map((entry, idx) => (
          <li
            key={entry.index}
            className="group relative overflow-hidden rounded-2xl border border-[var(--line)]/80 bg-white shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)]"
          >
            {idx === 0 ? (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[var(--brand)] to-[#7c3aed]" aria-hidden="true" />
            ) : null}
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-subtle)]">
                    턴 {entry.index}
                  </span>
                  <p className="mt-0.5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {entry.question}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-xl bg-[var(--surface-soft)] p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--match-soft)] text-[var(--match)]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="ui-card-title flex-1 leading-relaxed">
                  {entry.answer}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
