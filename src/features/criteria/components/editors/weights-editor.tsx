import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { CriteriaPayload } from "@/lib/schemas/criteria";

type Weights = CriteriaPayload["weights"];
type WeightKey = keyof Weights;

const WEIGHT_KEYS: WeightKey[] = ["techMatch", "roleMatch", "regionMatch", "freshness"];
const WEIGHT_LABEL: Record<WeightKey, string> = {
  techMatch: "기술 스택",
  roleMatch: "직무 적합도",
  regionMatch: "지역",
  freshness: "최신성",
};

/** Redistributes the other three weights so the total always stays exactly 100. */
function redistribute(weights: Weights, changedKey: WeightKey, rawValue: number): Weights {
  const clamped = Math.max(0, Math.min(100, Math.round(rawValue)));
  const others = WEIGHT_KEYS.filter((k) => k !== changedKey);
  const othersTotal = others.reduce((sum, k) => sum + weights[k], 0);
  const remaining = 100 - clamped;

  const next = { ...weights, [changedKey]: clamped } as Weights;
  let assigned = 0;
  others.forEach((k, i) => {
    if (i === others.length - 1) {
      next[k] = remaining - assigned;
      return;
    }
    const share =
      othersTotal === 0
        ? Math.round(remaining / others.length)
        : Math.round((weights[k] / othersTotal) * remaining);
    next[k] = share;
    assigned += share;
  });

  return next;
}

interface WeightsEditorProps {
  value: Weights;
  onChange: (value: Weights) => void;
}

export function WeightsEditor({ value, onChange }: WeightsEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      {WEIGHT_KEYS.map((key) => (
        <div key={key} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor={`weight-${key}`}>{WEIGHT_LABEL[key]}</Label>
            <span className="text-sm text-[var(--text-muted)]">{value[key]}%</span>
          </div>
          <Slider
            id={`weight-${key}`}
            min={0}
            max={100}
            step={5}
            value={[value[key]]}
            onValueChange={([v]) => onChange(redistribute(value, key, v))}
            aria-label={WEIGHT_LABEL[key]}
            aria-valuetext={`${value[key]}%`}
          />
        </div>
      ))}
      <p className="text-xs text-[var(--text-subtle)]" aria-live="polite">
        합계 {WEIGHT_KEYS.reduce((sum, k) => sum + value[k], 0)}% (자동으로 100%에 맞춰져요)
      </p>
    </div>
  );
}
