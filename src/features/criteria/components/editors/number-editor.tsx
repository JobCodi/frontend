import { Input } from "@/components/ui/input";

interface NumberEditorProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

export function NumberEditor({ label, value, onChange }: NumberEditorProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        step={100}
        aria-label={label}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? null : Number(raw));
        }}
        className="w-32"
      />
      <span className="text-sm text-[var(--text-muted)]">만원 이상</span>
    </div>
  );
}
