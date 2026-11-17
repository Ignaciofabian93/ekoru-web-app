"use client";
import clsx from "clsx";
import { CreditCard, ShieldCheck } from "lucide-react";

import { SectionCard } from "@/components/Patterns/SectionCard";
import { Text } from "@/components/Primitives/Text";
import type { Currency } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { PaymentProviderId } from "@/types/checkout";

import { availableProvidersFor } from "../constants/paymentProviders";

type Props = {
  value: PaymentProviderId | null;
  currency: Currency;
  onChange: (provider: PaymentProviderId) => void;
};

export function PaymentMethodPicker({ value, currency, onChange }: Props) {
  const { t } = useTranslation("cart");
  const providers = availableProvidersFor(currency);

  const providerLabel = value ? t(`checkout.payment.providers.${value}`) : "";

  return (
    <SectionCard
      title={t("checkout.payment.sectionTitle")}
      subtitle={t("checkout.payment.providerLabel")}
      icon={CreditCard}
      tone="primary"
    >
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {providers.map((provider) => {
            const selected = value === provider.id;
            return (
              <li key={provider.id}>
                <button
                  type="button"
                  onClick={() => onChange(provider.id)}
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
                      "flex size-10 shrink-0 items-center justify-center rounded-lg font-sans text-xs font-bold",
                      selected
                        ? "bg-primary text-on-primary"
                        : "bg-background-secondary text-primary",
                    )}
                  >
                    {provider.id.slice(0, 2)}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <Text variant="span" weight="semibold">
                      {t(`checkout.payment.providers.${provider.id}`)}
                    </Text>
                    <Text variant="small" color="secondary">
                      {t(`checkout.payment.providers.${provider.id}_desc`)}
                    </Text>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {value ? (
          <div className="flex items-start gap-2 rounded-lg bg-primary-light-bg p-3">
            <ShieldCheck size={18} className="mt-px text-primary" strokeWidth={2} />
            <div className="flex flex-col gap-0.5">
              <Text variant="span" weight="semibold" size="sm" color="primary">
                {t("checkout.payment.secureBadge")}
              </Text>
              <Text variant="small" color="secondary">
                {t("checkout.payment.redirectNotice", { provider: providerLabel })}
              </Text>
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
