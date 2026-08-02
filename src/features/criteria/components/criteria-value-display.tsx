import type { CriteriaFieldKey, CriteriaPayload } from "@/lib/schemas/criteria";
import type { TaxonomyOption } from "@/lib/schemas/taxonomy";
import { formatSalaryManwon } from "../lib/salary";

function labelFor(code: string, options: TaxonomyOption[]): string {
  return options.find((option) => option.code === code)?.label ?? code;
}

interface CriteriaValueDisplayProps {
  field: CriteriaFieldKey;
  criteria: CriteriaPayload;
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
      return <span>{formatSalaryManwon(value)}만원 이상</span>;
    }
    case "weights": {
      const { weights } = criteria;
      return (
        <span>
          기술 {weights.techMatch}% · 직무 {weights.roleMatch}% · 지역 {weights.regionMatch}% ·
          최신성 {weights.freshness}%
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
