interface TypingIndicatorProps {
  /** Shown after ~3s of waiting, per screens.md's discovery loading spec. */
  showSlowHint?: boolean;
}

export function TypingIndicator({ showSlowHint = false }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 text-[var(--text-muted)]">
      <span className="flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-3 py-2" aria-hidden="true">
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--brand)]" />
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--brand)]" />
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--brand)]" />
      </span>
      <span className="text-sm font-medium">
        {showSlowHint ? "조금만 더요… AI가 다음 질문을 준비하고 있어요" : "답변을 분석하고 있어요"}
      </span>
    </div>
  );
}
