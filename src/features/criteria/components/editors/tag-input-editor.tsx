"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TagInputEditorProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  maxItems: number;
  maxLength: number;
}

export function TagInputEditor({ label, value, onChange, maxItems, maxLength }: TagInputEditorProps) {
  const [draft, setDraft] = useState("");
  const atLimit = value.length >= maxItems;

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed || atLimit) return;
    if (value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed.slice(0, maxLength)]);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="list" aria-label={label}>
        {value.map((tag) => (
          <span
            key={tag}
            role="listitem"
            className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-sm text-[var(--brand-strong)]"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              aria-label={`${tag} 삭제`}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder={atLimit ? `최대 ${maxItems}개까지 입력할 수 있어요` : "입력 후 Enter"}
          disabled={atLimit}
          maxLength={maxLength}
          aria-label={`${label} 추가`}
        />
      </div>
      <p className="text-xs text-[var(--text-subtle)]">
        {value.length}/{maxItems}개 · 항목당 최대 {maxLength}자
      </p>
    </div>
  );
}
