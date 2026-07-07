"use client";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { Check } from "lucide-react";

import { BUSINESS_TARGETS, type PublishTarget } from "../../constants/options";

export function TargetStep({
  target,
  allowedTargets,
  onSelect,
}: {
  target: PublishTarget | null;
  allowedTargets: Exclude<PublishTarget, "MARKETPLACE">[];
  onSelect: (target: Exclude<PublishTarget, "MARKETPLACE">) => void;
}) {
  const { t } = useTranslation("publish");

  const options = BUSINESS_TARGETS.filter((option) =>
    allowedTargets.includes(option.value),
  );

  return (
    <div className="flex flex-col gap-3">
      {options.map(({ value, icon: Icon, labelKey, descKey }) => {
        const selected = target === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={selected}
            className={clsx(
              "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
              selected
                ? "border-primary bg-primary-light-bg"
                : "border-input-border bg-surface",
            )}
          >
            <span
              className={clsx(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                selected
                  ? "bg-primary text-white"
                  : "bg-background-tertiary text-foreground-tertiary",
              )}
            >
              <Icon size={20} color="currentColor" strokeWidth={2} />
            </span>
            <span className="flex flex-1 flex-col">
              <Text variant="span" weight="bold">
                {t(labelKey)}
              </Text>
              <Text variant="small" color="tertiary">
                {t(descKey)}
              </Text>
            </span>
            <span
              className={clsx(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                selected
                  ? "border-primary bg-primary"
                  : "border-border-strong bg-transparent",
              )}
            >
              {selected && <Check size={12} color="#ffffff" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
