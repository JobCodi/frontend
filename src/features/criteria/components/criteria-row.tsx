"use client";

import { Button } from "@/components/ui/button";
import {
  isPatchableCriteriaField,
  type CriteriaFieldKey,
  type CriteriaPayload,
  type CriteriaSource,
  type PatchCriteriaRequest,
} from "@/lib/schemas/criteria";
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
  criteria: CriteriaPayload;
  source: CriteriaSource | undefined;
  taxonomy: Taxonomy;
  onSave: (patch: PatchCriteriaRequest) => void;
  isSaving: boolean;
}

export function CriteriaRow({ field, criteria, source, taxonomy, onSave, isSaving }: CriteriaRowProps) {
  const { editingField, draft, startEdit, setDraft, cancelEdit } = useCriteriaEditStore();
  const isEditing = editingField === field;
  const label = CRITERIA_FIELD_LABEL[field];
  const options = optionsForField(field, taxonomy, criteria);
  // PATCH only accepts a subset of fields; the rest come from /start and
  // can't be changed without a new session.
  const editable = isPatchableCriteriaField(field);

  function handleEditClick() {
    startEdit(field, criteria[field]);
  }

  function handleSave() {
    if (!isPatchableCriteriaField(field)) return;
    onSave({ [field]: draft } as PatchCriteriaRequest);
  }

  return (
    <div className="border-b border-[var(--line)] bg-white px-4 py-4 transition-colors last:border-b-0 hover:bg-[var(--surface-soft)]/50 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
          <SourceLabel source={source} />
        </div>
        {editable && !isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--brand)] shadow-sm transition-colors hover:border-[var(--brand)]/30 hover:bg-[var(--brand-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            수정
          </button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)]/60 p-3">
          <CriteriaFieldEditor
            field={field}
            options={options}
            draft={draft}
            setDraft={setDraft}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={isSaving} className="rounded-lg">
              취소
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="rounded-lg">
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-[15px] leading-6 text-[var(--text)]">
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
      const limits = TAG_FIELD_LIMITS[field] ?? { maxItems: 10, maxLength: 32 };
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
          value={draft as CriteriaPayload["weights"]}
          onChange={setDraft}
        />
      );
    default:
      return null;
  }
}
