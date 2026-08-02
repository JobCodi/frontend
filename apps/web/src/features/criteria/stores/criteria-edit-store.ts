import { create } from "zustand";
import type { CriteriaFieldKey } from "@/lib/schemas/criteria";

/**
 * Which field is currently being edited inline on /criteria, and its
 * not-yet-saved draft value. Client-only pre-save state — the confirmed
 * criteria themselves stay in TanStack Query (data-flow.md §4.3).
 */
interface CriteriaEditStore {
  editingField: CriteriaFieldKey | null;
  draft: unknown;
  startEdit: (field: CriteriaFieldKey, initialValue: unknown) => void;
  setDraft: (value: unknown) => void;
  cancelEdit: () => void;
}

export const useCriteriaEditStore = create<CriteriaEditStore>((set) => ({
  editingField: null,
  draft: null,
  startEdit: (field, initialValue) => set({ editingField: field, draft: initialValue }),
  setDraft: (value) => set({ draft: value }),
  cancelEdit: () => set({ editingField: null, draft: null }),
}));
