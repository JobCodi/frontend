import type { CriteriaSource } from "@/lib/schemas/criteria";

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

  return <span className="text-xs text-[var(--text-subtle)]">{text}</span>;
}
