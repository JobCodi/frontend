interface TypingIndicatorProps {
  /** Shown after ~3s of waiting, per screens.md's discovery loading spec. */
  showSlowHint?: boolean;
}

export function TypingIndicator({ showSlowHint = false }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-[var(--text-muted)]">
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-subtle)]" />
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-subtle)]" />
        <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-subtle)]" />
      </span>
      {showSlowHint ? <span className="text-sm">조금만 더요</span> : null}
    </div>
  );
}
