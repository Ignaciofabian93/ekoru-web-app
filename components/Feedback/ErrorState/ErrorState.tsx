import clsx from "clsx";
import { AlertCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

export type ErrorStateTone = "error" | "muted";

export interface ErrorStateProps {
  /** Already-translated copy — shared components take text as props. */
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** `error` for a genuine failure, `muted` for an expected miss (404). */
  tone?: ErrorStateTone;
  /** A retry `Button` or a `Link` back to safety. */
  action?: ReactNode;
  className?: string;
}

const ICON_TONE: Record<ErrorStateTone, string> = {
  error: "text-danger",
  muted: "text-foreground-muted",
};

/**
 * A failed or missing resource. Distinct from `EmptyState`, which means "this
 * worked, there's just nothing in it".
 */
export function ErrorState({
  title,
  description,
  icon: Icon = AlertCircle,
  tone = "error",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={clsx(
        "mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center",
        className,
      )}
    >
      <Icon size={48} className={ICON_TONE[tone]} strokeWidth={1.4} aria-hidden />
      <Title level="h2" size="h4" weight="semibold" align="center">
        {title}
      </Title>
      {description && (
        <Text variant="p" size="sm" color="secondary" align="center">
          {description}
        </Text>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
