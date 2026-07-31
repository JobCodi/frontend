import type { CriteriaFieldKey, CriteriaFields } from "@/lib/schemas/criteria";
import type { TaxonomyOption } from "@/lib/schemas/taxonomy";

function labelFor(value: string, options: TaxonomyOption[]): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

interface CriteriaValueDisplayProps {
  field: CriteriaFieldKey;
  criteria: CriteriaFields;
  options: TaxonomyOption[];
}

export function CriteriaValueDisplay({ field, criteria, options }: CriteriaValueDisplayProps) {
  switch (field) {
    case "companySizes":
    case "regions":
    case "employmentTypes":
    case "roles": {
      const values = criteria[field];
      if (values.length === 0) return <Empty />;
      return <span>{values.map((v) => labelFor(v, options)).join(" · ")}</span>;
    }
    case "jobFamily":
    case "experienceLevel": {
      const value = criteria[field];
      if (!value) return <Empty />;
      return <span>{labelFor(value, options)}</span>;
    }
    case "techStack":
    case "keywords":
    case "excludeKeywords": {
      const values = criteria[field];
      if (values.length === 0) return <Empty />;
      return <span>{values.join(" · ")}</span>;
    }
    case "salaryMin": {
      const value = criteria.salaryMin;
      if (value === null) return <Empty />;
      return <span>{value.toLocaleString("ko-KR")}만원 이상</span>;
    }
    case "weights": {
      const { weights } = criteria;
      return (
        <span>
          기술 {weights.techStack}% · 직무 {weights.role}% · 지역 {weights.region}% · 최신성{" "}
          {weights.recency}%
        </span>
      );
    }
    default:
      return <Empty />;
  }
}

function Empty() {
  return <span className="text-[var(--text-subtle)]">설정 안 함</span>;
}
