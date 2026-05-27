"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const TONE_CLASS: Record<NonNullable<SectionCardProps["tone"]>, string> = {
  default: "bg-primary-light/20 text-primary",
  primary: "bg-primary text-on-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  tone = "default",
  className,
  headerRight,
  children,
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-border-light bg-surface p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                TONE_CLASS[tone],
              )}
            >
              <Icon size={20} color="currentColor" strokeWidth={2} />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <Title level="h3" size="h6" weight="semibold">
              {title}
            </Title>
            {subtitle && (
              <Text variant="span" size="sm" color="tertiary">
                {subtitle}
              </Text>
            )}
          </div>
        </div>
        {headerRight}
      </header>
      <div>{children}</div>
    </section>
  );
}
