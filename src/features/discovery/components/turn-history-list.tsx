import type { AnsweredTurn } from "@/lib/schemas/session";

interface TurnHistoryListProps {
  /**
   * Answered turns from `GET /sessions/:id`. Read-only: the backend has no
   * turn-rollback endpoint and `POST /turns` always applies an answer to the
   * *pending* turn, so an "edit this answer" affordance could only ever
   * mislabel the next turn.
   */
  turns: AnsweredTurn[];
}

export function TurnHistoryList({ turns }: TurnHistoryListProps) {
  if (turns.length === 0) return null;

  const reversed = [...turns].reverse();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs text-[var(--text-subtle)]">
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        이전 대화
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
      </div>
      <ul className="flex flex-col gap-4">
        {reversed.map((entry) => (
          <li key={entry.index} className="flex flex-col gap-1.5">
            <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
              <span aria-hidden="true">🤖</span>
              <span>
                (턴 {entry.index}) {entry.question}
              </span>
            </p>
            <div className="flex items-center gap-2 pl-6 text-[15px] text-[var(--text)]">
              <span aria-hidden="true">🙂</span>
              <span>{entry.answer}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
