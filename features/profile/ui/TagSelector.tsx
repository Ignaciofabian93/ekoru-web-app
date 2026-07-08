"use client";
import clsx from "clsx";
import { Check } from "lucide-react";

import type { BusinessTag } from "../constants/businessTags";

interface TagSelectorProps {
  options: BusinessTag[];
  selected: string[];
  onToggle: (id: string) => void;
  max: number;
  getLabel: (tag: BusinessTag) => string;
  loading?: boolean;
}

export function TagSelector({
  options,
  selected,
  onToggle,
  max,
  getLabel,
  loading,
}: TagSelectorProps) {
  const atMax = selected.length >= max;

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-border-light"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const isSelected = selected.includes(tag.id);
        const disabled = !isSelected && atMax;
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggle(tag.id)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              isSelected
                ? "border-primary bg-primary text-on-primary"
                : "border-border-light bg-surface text-foreground-secondary hover:border-primary/50 hover:text-foreground",
              disabled &&
                "cursor-not-allowed opacity-40 hover:border-border-light hover:text-foreground-secondary",
            )}
          >
            {isSelected && <Check size={14} strokeWidth={2.5} />}
            {getLabel(tag)}
          </button>
        );
      })}
    </div>
  );
}
