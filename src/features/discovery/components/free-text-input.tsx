"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FreeTextInputProps {
  disabled?: boolean;
  onSubmit: (text: string) => void;
}

export function FreeTextInput({ disabled = false, onSubmit }: FreeTextInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="discovery-free-text" className="sr-only">
        직접 입력하기
      </label>
      <Input
        id="discovery-free-text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="직접 입력하기..."
        disabled={disabled}
        className="h-11 flex-1 rounded-xl border-[var(--line)] bg-[var(--surface-soft)] focus-visible:ring-[var(--brand)]"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || value.trim() === ""}
        aria-label="답변 보내기"
        className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.25)] hover:brightness-105 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
