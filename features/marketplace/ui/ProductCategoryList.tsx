"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import Link from "next/link";

import { NAMESPACE } from "../i18n";
import type { CatalogProductCategory } from "../types";

interface Props {
  productCategories: CatalogProductCategory[];
}

export function ProductCategoryList({ productCategories }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (productCategories.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.productCategories")}
      </Title>
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {productCategories.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            className="shrink-0 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
