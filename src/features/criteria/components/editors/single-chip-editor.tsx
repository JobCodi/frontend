import { ChipGroup, ChoiceChip } from "@/components/ui/choice-chip";
import type { TaxonomyOption } from "@/lib/schemas/taxonomy";

interface SingleChipEditorProps {
  label: string;
  options: TaxonomyOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export function SingleChipEditor({ label, options, value, onChange }: SingleChipEditorProps) {
  if (options.length === 0) {
    return <p className="text-sm text-[var(--text-subtle)]">선택지를 불러오지 못했어요.</p>;
  }

  return (
    <ChipGroup label={label} multiple={false}>
      {options.map((option) => (
        <ChoiceChip
          key={option.value}
          role="radio"
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </ChoiceChip>
      ))}
    </ChipGroup>
  );
}
