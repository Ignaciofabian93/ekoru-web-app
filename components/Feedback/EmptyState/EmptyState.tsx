import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

export type EmptyStateVariant = "compact" | "default" | "prominent";

export interface EmptyStateProps {
  /** Already-translated copy — shared components take text as props. */
  title: string;
  description?: string;
  icon?: LucideIcon;
  /**
   * `compact` for an inline "nothing here" note, `default` for a section
   * placeholder, `prominent` for a whole-screen state with a call to action.
   */
  variant?: EmptyStateVariant;
  /** Label for the built-in primary button. Pair with `onAction`. */
  actionLabel?: string;
  onAction?: () => void;
  /**
   * An arbitrary call to action (a `Link`, say) for cases the built-in button
   * can't cover. Takes precedence over `actionLabel` / `onAction`.
   */
  action?: ReactNode;
  /** Dashed outline. On by default; off for full-screen states. */
  bordered?: boolean;
  className?: string;
}

const CONTAINER: Record<EmptyStateVariant, string> = {
  compact: "gap-1 px-4 py-12",
  default: "gap-3 px-4 py-16",
  prominent: "gap-4 px-6 py-14",
};

const ICON_BADGE: Record<EmptyStateVariant, { box: string; size: number }> = {
  compact: { box: "size-10", size: 20 },
  default: { box: "size-12", size: 24 },
  prominent: { box: "size-16", size: 28 },
};

/**
 * The "nothing to show" placeholder. One component behind the community and
 * services detail placeholders, the profile dashboard panels and the empty
 * cart, so they no longer drift apart in padding, icon size and border style.
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  variant = "default",
  actionLabel,
  onAction,
  action,
  bordered = true,
  className,
}: EmptyStateProps) {
  const badge = ICON_BADGE[variant];
  const isProminent = variant === "prominent";

  const cta =
    action ??
    (actionLabel && onAction ? (
      <Button text={actionLabel} variant="primary" size="md" onPress={onAction} />
    ) : null);

  return (
    <div
      className={clsx(
        "flex flex-col items-center text-center",
        CONTAINER[variant],
        bordered && "rounded-2xl border border-dashed border-border-light bg-surface",
        className,
      )}
    >
      {Icon && (
        <span
          className={clsx(
            "flex items-center justify-center rounded-full text-primary",
            isProminent ? "bg-primary-light/20" : "bg-primary/10",
            badge.box,
          )}
        >
          <Icon size={badge.size} color="currentColor" strokeWidth={1.75} aria-hidden />
        </span>
      )}

      <div className={clsx("flex flex-col gap-1", isProminent && "max-w-sm")}>
        {isProminent ? (
          <Title level="h3" size="h5" weight="semibold" align="center">
            {title}
          </Title>
        ) : (
          <Text weight="semibold">{title}</Text>
        )}
        {description && (
          <Text
            variant="p"
            size="sm"
            color={isProminent ? "tertiary" : "secondary"}
            align="center"
          >
            {description}
          </Text>
        )}
      </div>

      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}
