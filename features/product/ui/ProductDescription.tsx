"use client";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

export function ProductDescription({ description }: { description?: string | null }) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("description.title")}
      </h2>
      {description ? (
        <p className="leading-relaxed whitespace-pre-line text-foreground-secondary">
          {description}
        </p>
      ) : (
        <p className="text-sm text-foreground-tertiary italic">
          {t("description.empty")}
        </p>
      )}
    </section>
  );
}
