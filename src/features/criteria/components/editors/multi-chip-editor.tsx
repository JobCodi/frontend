import { ChipGroup, ChoiceChip } from "@/components/ui/choice-chip";
import type { TaxonomyOption } from "@/lib/schemas/taxonomy";

interface MultiChipEditorProps {
  label: string;
  options: TaxonomyOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiChipEditor({ label, options, value, onChange }: MultiChipEditorProps) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((item) => item !== v) : [...value, v]);
  }

  if (options.length === 0) {
    return <p className="text-sm text-[var(--text-subtle)]">선택지를 불러오지 못했어요.</p>;
  }

  return (
    <ChipGroup label={label} multiple>
      {options.map((option) => (
        <ChoiceChip
          key={option.value}
          role="checkbox"
          selected={value.includes(option.value)}
          onClick={() => toggle(option.value)}
        >
          {option.label}
        </ChoiceChip>
      ))}
    </ChipGroup>
  );
}
