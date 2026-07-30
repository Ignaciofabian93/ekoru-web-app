"use client";

import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Primitives/Title";
import { useBusinessType, useSellerLocation } from "@/hooks/useSellerData";

export function SellerDetails({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);

  const businessType = useBusinessType(seller);
  const location = useSellerLocation(seller);

  const rows = [
    {
      label: t("details.sellerType"),
      value: t(`sellerTypes.${seller.sellerType}`),
    },
    businessType && {
      label: t("details.businessType"),
      value: t(`businessTypes.${businessType}`),
    },
    location && { label: t("details.location"), value: location },
    seller.phone && { label: t("details.phone"), value: seller.phone },
    seller.email && { label: t("details.email"), value: seller.email },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  if (rows.length === 0) return null;

  return (
    <section className="mb-3">
      <Title level="h2" size="h6" weight="medium" className="mb-4">
        {t("details.title")}
      </Title>
      <dl className="flex flex-col divide-y divide-border-light overflow-hidden">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3">
            <dt className="shrink-0 text-sm text-foreground font-medium">{row.label}</dt>
            <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground-secondary">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
