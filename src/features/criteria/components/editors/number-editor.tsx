import { Input } from "@/components/ui/input";
import { fromManwon, toManwon } from "../../lib/salary";

interface NumberEditorProps {
  label: string;
  /** In KRW (원), the unit the API uses. The input itself is in 만원. */
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
        aria-label={`${label} (만원)`}
        value={value === null ? "" : toManwon(value)}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? null : fromManwon(Number(raw)));
        }}
        className="w-32"
      />
      <span className="text-sm text-[var(--text-muted)]">만원 이상</span>
    </div>
  );
}
