"use client";
import { ShieldCheck, Truck, Undo2 } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Text } from "@/components/Text/Text";
import clsx from "clsx";

export function ProductTrust() {
  const { t } = useTranslation(NAMESPACE);

  const items = [
    {
      icon: ShieldCheck,
      title: t("trust.secureCheckout"),
      hint: t("trust.secureCheckoutHint"),
      style: "bg-secondary/60 text-white",
    },
    {
      icon: Undo2,
      title: t("trust.buyerProtection"),
      hint: t("trust.buyerProtectionHint"),
      style: "bg-accent/60 text-white",
    },
    {
      icon: Truck,
      title: t("trust.shipping"),
      hint: t("trust.shippingHint"),
      style: "bg-primary/60 text-white",
    },
  ];

  return (
    <ul
      className={clsx(
        "bg-white flex flex-col divide-y",
        "divide-border-light rounded-2xl",
        "border border-border-light",
      )}
    >
      {items.map(({ icon: Icon, title, hint, style }) => (
        <li key={title} className="flex items-start gap-3 px-4 py-3">
          <span
            className={clsx(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              style,
            )}
          >
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <div className="flex flex-col">
            <Text variant="span" weight="semibold" size="sm">
              {title}
            </Text>
            <Text variant="span" weight="semibold" size="xs">
              {hint}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}
