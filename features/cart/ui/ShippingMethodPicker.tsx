"use client";
import clsx from "clsx";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import type { ShippingMethod } from "@/types/checkout";

import { SHIPPING_METHODS } from "../constants/shippingMethods";

type Props = {
  value: ShippingMethod | null;
  onChange: (method: ShippingMethod) => void;
};

export function ShippingMethodPicker({ value, onChange }: Props) {
  const { t } = useTranslation("cart");

  return (
    <section className="flex flex-col gap-3">
      <Title level="h3" size="h5" weight="semibold">
        {t("checkout.shipping.methodTitle")}
      </Title>
      <ul className="flex flex-col gap-2">
        {SHIPPING_METHODS.map((method) => {
          const Icon = method.icon;
          const selected = value === method.id;
          const disabled = method.id === "CARRIER";
          return (
            <li key={method.id}>
              <button
                type="button"
                onClick={() => !disabled && onChange(method.id)}
                disabled={disabled}
                aria-pressed={selected}
                className={clsx(
                  "flex w-full cursor-pointer items-start gap-3 rounded-xl border-2 bg-surface p-3 text-left transition-colors",
                  selected
                    ? "border-primary"
                    : "border-border-light hover:border-foreground-tertiary",
                  disabled && "cursor-not-allowed opacity-60",
                )}
              >
                <div
                  className={clsx(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    selected
                      ? "bg-primary text-on-primary"
                      : "bg-background-secondary text-primary",
                  )}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <Text variant="span" weight="semibold">
                    {t(`checkout.shipping.methods.${method.id}`)}
                  </Text>
                  <Text variant="small" color="secondary">
                    {t(`checkout.shipping.methods.${method.id}_desc`)}
                  </Text>
                  {disabled ? (
                    <Text variant="small" color="warning">
                      {t("checkout.shipping.methods.carrierUnavailable")}
                    </Text>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
