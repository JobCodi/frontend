import { ChipGroup, ChoiceChip } from "@/components/ui/choice-chip";
import type { TaxonomyOption } from "@/lib/schemas/taxonomy";

interface GoalFieldSectionProps {
  label: string;
  required?: boolean;
  hint?: string;
  options: readonly TaxonomyOption[];
  mode: "single" | "multiple";
  selected: string[];
  onToggle: (value: string) => void;
  emptyMessage?: string;
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
}: GoalFieldSectionProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="flex items-baseline gap-1.5 text-[13px] font-medium leading-5 text-[var(--text)]">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[var(--danger)]">
            *
          </span>
        ) : null}
        {hint ? <span className="text-[var(--text-subtle)]">{hint}</span> : null}
      </legend>
      {options.length === 0 ? (
        <p className="text-sm text-[var(--text-subtle)]">{emptyMessage}</p>
      ) : (
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
      )}
    </fieldset>
  );
}
