import { MessageCircle } from "lucide-react";
import type { AnsweredTurn } from "@/lib/schemas/session";

interface TurnHistoryListProps {
  turns: AnsweredTurn[];
}

export function TurnHistoryList({ turns }: TurnHistoryListProps) {
  if (turns.length === 0) return null;

  const reversed = [...turns].reverse();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
        이전 대화
        <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
      </div>
      <ul className="flex flex-col gap-4">
        {reversed.map((entry) => (
          <li key={entry.index} className="flex flex-col gap-2 rounded-xl border border-gray-50 bg-gray-50/30 p-4">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
              <span className="flex-1">
                <span className="text-xs font-medium text-gray-400">턴 {entry.index}</span>
                <span className="ml-2">{entry.question}</span>
              </span>
            </div>
            <div className="flex items-start gap-2 pl-8 text-[15px] text-gray-900">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                <span className="text-xs">✓</span>
              </span>
              <span className="flex-1 font-medium">{entry.answer}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
