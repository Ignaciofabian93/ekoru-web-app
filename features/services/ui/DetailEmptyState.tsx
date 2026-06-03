"use client";
import { Text } from "@/components/Text/Text";

interface Props {
  title: string;
  hint?: string;
}

export function DetailEmptyState({ title, hint }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-surface px-4 py-12 text-center">
      <Text weight="semibold">{title}</Text>
      {hint && (
        <Text size="sm" color="secondary">
          {hint}
        </Text>
      )}
    </div>
  );
}
