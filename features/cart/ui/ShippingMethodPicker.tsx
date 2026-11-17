"use client";
import clsx from "clsx";
import { Package } from "lucide-react";
import type { ReactNode } from "react";

import { SectionCard } from "@/components/Patterns/SectionCard";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import type { ShippingMethod } from "@/types/checkout";

import { AVAILABLE_SHIPPING_METHODS } from "../constants/shippingMethods";

type Props = {
  value: ShippingMethod | null;
  onChange: (method: ShippingMethod) => void;
  /** What the chosen method asks for next — the meeting-point notice. */
  children?: ReactNode;
};

/**
 * Only the methods checkout offers today (store pickup, meeting point). Home
 * delivery and courier stay out of the list until their switchboard flags flip
 * — see `constants/shippingMethods.ts`.
 */
export function ShippingMethodPicker({ value, onChange, children }: Props) {
  const { t } = useTranslation("cart");

  return (
    <SectionCard title={t("checkout.shipping.methodTitle")} icon={Package} tone="primary">
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {AVAILABLE_SHIPPING_METHODS.map((method) => {
            const Icon = method.icon;
            const selected = value === method.id;
            return (
              <li key={method.id}>
                <button
                  type="button"
                  onClick={() => onChange(method.id)}
                  aria-pressed={selected}
                  className={clsx(
                    "flex w-full cursor-pointer items-start gap-3 rounded-xl border-2 bg-surface p-3 text-left transition-colors",
                    selected
                      ? "border-primary"
                      : "border-border-light hover:border-foreground-tertiary",
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
                    <Icon size={20} strokeWidth={2} aria-hidden />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <Text variant="span" weight="semibold">
                      {t(`checkout.shipping.methods.${method.id}`)}
                    </Text>
                    <Text variant="small" color="secondary">
                      {t(`checkout.shipping.methods.${method.id}_desc`)}
                    </Text>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        {children}
      </div>
    </SectionCard>
  );
}
