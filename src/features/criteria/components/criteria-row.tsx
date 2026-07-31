"use client";

import { Button } from "@/components/ui/button";
import type { CriteriaFieldKey, CriteriaFields, CriteriaSource } from "@/lib/schemas/criteria";
import type { Taxonomy } from "@/lib/schemas/taxonomy";
import { CRITERIA_FIELD_EDITOR, CRITERIA_FIELD_LABEL, TAG_FIELD_LIMITS } from "../types";
import { useCriteriaEditStore } from "../stores/criteria-edit-store";
import { optionsForField } from "../lib/options-for-field";
import { CriteriaValueDisplay } from "./criteria-value-display";
import { SourceLabel } from "./source-label";
import { MultiChipEditor } from "./editors/multi-chip-editor";
import { SingleChipEditor } from "./editors/single-chip-editor";
import { TagInputEditor } from "./editors/tag-input-editor";
import { NumberEditor } from "./editors/number-editor";
import { WeightsEditor } from "./editors/weights-editor";

interface CriteriaRowProps {
  field: CriteriaFieldKey;
  criteria: CriteriaFields;
  source: CriteriaSource | undefined;
  taxonomy: Taxonomy;
  onSave: (patch: Partial<CriteriaFields>) => void;
  isSaving: boolean;
}

export function CriteriaRow({ field, criteria, source, taxonomy, onSave, isSaving }: CriteriaRowProps) {
  const { editingField, draft, startEdit, setDraft, cancelEdit } = useCriteriaEditStore();
  const isEditing = editingField === field;
  const label = CRITERIA_FIELD_LABEL[field];
  const options = optionsForField(field, taxonomy, criteria);

  function handleEditClick() {
    startEdit(field, criteria[field]);
  }

  function handleSave() {
    onSave({ [field]: draft } as Partial<CriteriaFields>);
  }

  return (
    <div className="flex flex-col gap-2 border-b border-[var(--line)] py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-medium text-[var(--text)]">{label}</span>
          <SourceLabel source={source} />
        </div>
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="rounded-[var(--radius)] px-2 py-1 text-xs font-medium text-[var(--brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            수정
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <CriteriaFieldEditor
            field={field}
            options={options}
            draft={draft}
            setDraft={setDraft}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={isSaving}>
              취소
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-[15px] text-[var(--text)]">
          <CriteriaValueDisplay field={field} criteria={criteria} options={options} />
        </div>
      )}
    </div>
  );
}

interface CriteriaFieldEditorProps {
  field: CriteriaFieldKey;
  options: ReturnType<typeof optionsForField>;
  draft: unknown;
  setDraft: (value: unknown) => void;
}

function CriteriaFieldEditor({ field, options, draft, setDraft }: CriteriaFieldEditorProps) {
  const editorType = CRITERIA_FIELD_EDITOR[field];
  const label = CRITERIA_FIELD_LABEL[field];

  switch (editorType) {
    case "multi-chip":
      return (
        <MultiChipEditor
          label={label}
          options={options}
          value={(draft as string[] | null) ?? []}
          onChange={setDraft}
        />
      );
    case "single-chip":
      return (
        <SingleChipEditor
          label={label}
          options={options}
          value={draft as string | null}
          onChange={setDraft}
        />
      );
    case "tag-input": {
      const limits = TAG_FIELD_LIMITS[field] ?? { maxItems: 10, maxLength: 30 };
      return (
        <TagInputEditor
          label={label}
          value={(draft as string[] | null) ?? []}
          onChange={setDraft}
          maxItems={limits.maxItems}
          maxLength={limits.maxLength}
        />
      );
    }
    case "number":
      return <NumberEditor label={label} value={draft as number | null} onChange={setDraft} />;
    case "weights":
      return (
        <WeightsEditor
          value={draft as CriteriaFields["weights"]}
          onChange={setDraft}
        />
      );
    default:
      return null;
  }
}
