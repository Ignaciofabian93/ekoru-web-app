"use client";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  background?: "primary" | "success" | "warning" | "danger";
  className?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const TONE_CLASS: Record<NonNullable<SectionCardProps["tone"]>, string> = {
  default:
    "bg-linear-180 from-secondary-hover/10 to-secondary/5 text-secondary-dark border border-secondary-dark/60",
  primary:
    "bg-linear-180 from-primary-light/10 to-primary-hover/5 text-primary border border-primary/60",
  success:
    "bg-linear-180 from-success/10 to-success/5 text-success border border-success/60",
  warning: "bg-warning/10 text-warning",
  danger: "bg-linear-180 from-danger/10 to-danger/5 text-danger border border-danger/60",
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
        "rounded-2xl p-4 bg-white shadow-md shadow-slate-800/10 border border-slate-200 my-1",
        // BACKGROUND_CLASS[background],
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
            <Title level="h3" size="h5" weight="semibold">
              {title}
            </Title>
            {subtitle && (
              <Text variant="span" size="sm" color="secondary">
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
