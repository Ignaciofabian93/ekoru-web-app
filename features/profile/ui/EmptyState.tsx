"use client";
import MainButton from "@/components/Button/MainButton";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border-light bg-surface px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light/20 text-primary">
        <Icon size={28} color="currentColor" strokeWidth={1.5} />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <Title level="h3" size="h5" weight="semibold" align="center">
          {title}
        </Title>
        <Text variant="p" size="sm" color="tertiary" align="center">
          {description}
        </Text>
      </div>
      {actionLabel && onAction && (
        <div className="mt-2">
          <MainButton text={actionLabel} variant="primary" size="md" onPress={onAction} />
        </div>
      )}
    </div>
  );
}
