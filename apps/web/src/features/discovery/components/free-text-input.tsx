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
      />
      <Button
        type="submit"
        size="icon"
        variant="secondary"
        disabled={disabled || value.trim() === ""}
        aria-label="답변 보내기"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
