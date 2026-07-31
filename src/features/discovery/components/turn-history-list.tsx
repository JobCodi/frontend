"use client";

import { useState } from "react";
import type { TurnHistoryEntry } from "@/lib/schemas/session";
import { EditTurnDialog } from "./edit-turn-dialog";

interface TurnHistoryListProps {
  history: TurnHistoryEntry[];
  /**
   * MVP scope decision (screens.md /discovery "답변 수정"): there is no
   * turn-rollback API, so only the most recently answered turn can be
   * edited. Everything earlier is fixed until /criteria.
   */
  onEditLastTurn: (entry: TurnHistoryEntry) => void;
  disabled?: boolean;
}

export function TurnHistoryList({ history, onEditLastTurn, disabled = false }: TurnHistoryListProps) {
  const [pendingEdit, setPendingEdit] = useState<TurnHistoryEntry | null>(null);

  if (history.length === 0) return null;

  const lastTurnIndex = history[history.length - 1].turnIndex;
  const reversed = [...history].reverse();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs text-[var(--text-subtle)]">
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        이전 대화
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
      </div>
      <ul className="flex flex-col gap-4">
        {reversed.map((entry) => (
          <li key={entry.turnIndex} className="flex flex-col gap-1.5">
            <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
              <span aria-hidden="true">🤖</span>
              <span>
                (턴 {entry.turnIndex}) {entry.prompt}
              </span>
            </p>
            <div className="flex items-center gap-2 pl-6 text-[15px] text-[var(--text)]">
              <span aria-hidden="true">🙂</span>
              <span>{entry.answerLabel}</span>
              {entry.turnIndex === lastTurnIndex ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setPendingEdit(entry)}
                  className="ml-1 rounded-[var(--radius)] px-2 py-0.5 text-xs font-medium text-[var(--brand)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:pointer-events-none disabled:opacity-50"
                >
                  수정
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <EditTurnDialog
        open={pendingEdit !== null}
        onOpenChange={(open) => {
          if (!open) setPendingEdit(null);
        }}
        onConfirm={() => {
          if (pendingEdit) onEditLastTurn(pendingEdit);
          setPendingEdit(null);
        }}
      />
    </div>
  );
}
