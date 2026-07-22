"use client";
import { Text } from "@/components/Text/Text";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  hint?: string;
  icon?: LucideIcon;
}

export function DetailEmptyState({ title, hint, icon: Icon }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-light bg-surface px-4 py-16 text-center">
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon size={24} strokeWidth={1.75} />
        </span>
      )}
      <div className="flex flex-col gap-1">
        <Text weight="semibold">{title}</Text>
        {hint && (
          <Text size="sm" color="secondary">
            {hint}
          </Text>
        )}
      </div>
    </div>
  );
}
