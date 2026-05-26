"use client";

import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { getSellerBio } from "../sellerDisplay";

export function SellerAbout({ seller }: { seller: Seller }) {
  const { t } = useTranslation(NAMESPACE);
  const bio = getSellerBio(seller);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("about.title")}
      </h2>
      {bio ? (
        <p className="leading-relaxed whitespace-pre-line text-foreground-secondary">
          {bio}
        </p>
      ) : (
        <p className="text-sm text-foreground-tertiary italic">
          {t("about.empty")}
        </p>
      )}
    </section>
  );
}
