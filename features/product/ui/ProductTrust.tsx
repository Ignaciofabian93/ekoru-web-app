"use client";

import { ShieldCheck, Truck, Undo2 } from "lucide-react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

export function ProductTrust() {
  const { t } = useTranslation(NAMESPACE);

  const items = [
    {
      icon: ShieldCheck,
      title: t("trust.secureCheckout"),
      hint: t("trust.secureCheckoutHint"),
    },
    {
      icon: Undo2,
      title: t("trust.buyerProtection"),
      hint: t("trust.buyerProtectionHint"),
    },
    {
      icon: Truck,
      title: t("trust.shipping"),
      hint: t("trust.shippingHint"),
    },
  ];

  return (
    <ul className="bg-background-secondary flex flex-col divide-y divide-border-light rounded-2xl border border-border-light">
      {items.map(({ icon: Icon, title, hint }) => (
        <li key={title} className="flex items-start gap-3 px-4 py-3">
          <span className="bg-primary-light-bg flex size-9 shrink-0 items-center justify-center rounded-full text-primary">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{title}</span>
            <span className="text-xs text-foreground-secondary">{hint}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
