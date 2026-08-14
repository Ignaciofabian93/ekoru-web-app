"use client";
import { Text } from "@/components/Primitives/Text";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Toggle } from "@/components/Primitives/Toggle";

interface BaseRowProps {
  icon?: LucideIcon;
  label: string;
  description?: string;
  className?: string;
  /** Rendered just before the control — e.g. a "Proximamente" chip. */
  badge?: React.ReactNode;
}

interface ToggleRowProps extends BaseRowProps {
  kind: "toggle";
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

interface StaticRowProps extends BaseRowProps {
  kind?: "static";
  right?: React.ReactNode;
}

type SettingRowProps = ToggleRowProps | StaticRowProps;

export function SettingRow(props: SettingRowProps) {
  const { icon: Icon, label, description, className, badge } = props;

  return (
    <div
      className={clsx(
        "flex flex-wrap items-start gap-3 py-3.5 px-3",
        "border-b border-border-light last:border-b-0",
        className,
      )}
    >
      {Icon && (
        <div className="flex mb-1 shrink-0 items-center justify-center text-foreground-secondary">
          <Icon size={20} color="currentColor" strokeWidth={2} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-0.5">
        <Text variant="span" weight="semibold" size="base">
          {label}
        </Text>
        {description && (
          <Text variant="span" size="sm" color="secondary">
            {description}
          </Text>
        )}
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-2">
        {badge}
        {props.kind === "toggle" ? (
          <Toggle
            checked={props.checked}
            onChange={props.onChange}
            disabled={props.disabled}
            ariaLabel={label}
          />
        ) : (
          props.right
        )}
      </div>
    </div>
  );
}
