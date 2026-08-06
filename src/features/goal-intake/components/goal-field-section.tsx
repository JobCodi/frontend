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
    <fieldset className="flex flex-col gap-3">
      <legend className="flex items-baseline gap-2 text-sm font-medium text-gray-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
        ) : null}
        {hint ? (
          <span className="text-xs font-normal text-gray-500">({hint})</span>
        ) : null}
      </legend>
      {options.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="rounded-xl border border-gray-50 bg-gray-50/50 p-3">
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
