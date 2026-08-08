import type { CriteriaSource } from "@/lib/schemas/criteria";
import { cn } from "@/lib/utils/cn";

export function SourceLabel({ source }: { source: CriteriaSource | undefined }) {
  if (!source) return null;

  const text =
    source.origin === "turn"
      ? `${source.turnIndex}번째 답변`
      : source.origin === "form"
        ? "폼에서 입력"
        : source.origin === "manual"
          ? "직접 수정함"
          : "기본값";

  const tone =
    source.origin === "manual"
      ? "bg-[var(--brand-soft)] text-[var(--brand-strong)]"
      : source.origin === "default"
        ? "bg-[var(--surface-soft)] text-[var(--text-subtle)]"
        : "bg-[var(--surface-soft)] text-[var(--text-muted)]";

  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", tone)}>
      {text}
    </span>
  );
}
