import { ChipGroup, ChoiceChip } from "@/components/ui/choice-chip";
import type { TaxonomyOption } from "@/lib/schemas/taxonomy";
import { cn } from "@/lib/utils/cn";

interface GoalFieldSectionProps {
  label: string;
  required?: boolean;
  hint?: string;
  options: readonly TaxonomyOption[];
  mode: "single" | "multiple";
  selected: string[];
  onToggle: (value: string) => void;
  emptyMessage?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function GoalFieldSection({
  label,
  required = false,
  hint,
  options,
  mode,
  selected,
  onToggle,
  emptyMessage = "선택지를 불러오지 못했어요.",
  description,
  icon,
}: GoalFieldSectionProps) {
  const filled = selected.length > 0;

  return (
    <fieldset
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-sm transition-colors sm:p-5",
        filled ? "border-[var(--brand)]/20 ring-1 ring-[var(--brand-soft)]" : "border-[var(--line)]",
      )}
    >
      <legend className="mb-3 flex w-full items-center justify-between gap-3 px-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          {icon ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--brand)]">
              {icon}
            </span>
          ) : null}
          {label}
          {required ? (
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          ) : (
            <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-subtle)]">
              선택
            </span>
          )}
          {hint ? <span className="text-xs font-normal text-[var(--text-subtle)]">({hint})</span> : null}
        </span>
        {filled ? (
          <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-strong)]">
            {mode === "multiple" ? `${selected.length}개 선택` : "선택됨"}
          </span>
        ) : null}
      </legend>

      {description ? <p className="mb-3 px-1 text-xs leading-5 text-[var(--text-muted)]">{description}</p> : null}

      {options.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-soft)] px-4 py-6 text-center text-sm text-[var(--text-subtle)]">
          {emptyMessage}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--line)]/70 bg-gradient-to-b from-[var(--surface-soft)] to-white p-3 sm:p-4">
          <ChipGroup label={label} multiple={mode === "multiple"}>
            {options.map((option) => (
              <ChoiceChip
                key={option.code}
                role={mode === "multiple" ? "checkbox" : "radio"}
                selected={selected.includes(option.code)}
                onClick={() => onToggle(option.code)}
              >
                {option.label}
              </ChoiceChip>
            ))}
          </ChipGroup>
        </div>
      )}
    </fieldset>
  );
}
