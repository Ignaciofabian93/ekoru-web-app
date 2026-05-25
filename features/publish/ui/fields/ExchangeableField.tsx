"use client";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { Check } from "lucide-react";

export function ExchangeableField({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useTranslation("publish");

  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className={clsx(
        "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
        value
          ? "border-primary bg-primary-light-bg"
          : "border-input-border bg-surface",
      )}
    >
      <span
        className={clsx(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200",
          value
            ? "border-primary bg-primary"
            : "border-border-strong bg-transparent",
        )}
      >
        {value && <Check size={12} color="#ffffff" strokeWidth={3} />}
      </span>
      <span className="flex flex-1 flex-col">
        <Text variant="span" weight="medium">
          {t("form.isExchangeable")}
        </Text>
        <Text variant="small" color="tertiary">
          {t("form.isExchangeableHint")}
        </Text>
      </span>
    </button>
  );
}
