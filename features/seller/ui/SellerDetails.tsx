"use client";

import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";

export function SellerDetails({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);

  const businessType =
    seller.profile?.__typename === "BusinessProfile"
      ? seller.profile.businessType
      : undefined;

  const location = [seller.county?.county, seller.address]
    .filter(Boolean)
    .join(" · ");

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
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("details.title")}
      </h2>
      <dl className="bg-surface flex flex-col divide-y divide-border-light overflow-hidden rounded-2xl border border-border-light">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <dt className="text-sm text-foreground-secondary">{row.label}</dt>
            <dd className="truncate text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
