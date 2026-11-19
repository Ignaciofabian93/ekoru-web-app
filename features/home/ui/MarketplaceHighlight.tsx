"use client";
import Link from "next/link";
import type { Ref } from "react";
import { type SupportedLanguage } from "@/constants/settings";
import { useNearViewport } from "@/hooks/useNearViewport";
import { useTranslation } from "@/i18n/context";
import {
  useExchangeableProducts,
  useSaleProducts,
} from "../hooks/useMarketplaceProducts";
import { NAMESPACE } from "../i18n";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { ProductScroller } from "@/components/ProductCards";
import { Text } from "@/components/Primitives/Text";
import type { Product } from "@/types/product";
import MarketplaceCard from "@/components/ProductCards/MarketplaceCard";

const PAGE_SIZE = 8;

/**
 * The marketplace on the home screen, split by what the seller will accept: a
 * row of items open to a swap, and a row of items that are sale-only. The two
 * are disjoint by construction — one query forces `isExchangeable: true`
 * server-side, the other filters for `false` — so nothing appears twice.
 *
 * The rows are two sibling sections, laid out exactly as `StoresHighlight` and
 * `StoreProductsHighlight` are: the page container owns the gap between them,
 * and each keeps its own heading at the same level as every other highlight.
 */
export function MarketplaceHighlight({ lang }: { lang: SupportedLanguage }) {
  // Below the fold: both rows wait until the visitor scrolls toward the first.
  const [sectionRef, near] = useNearViewport<HTMLElement>();
  const exchange = useExchangeableProducts({ pageSize: PAGE_SIZE, skip: !near });
  const sale = useSaleProducts({ pageSize: PAGE_SIZE, skip: !near });

  return (
    <>
      <ProductRow
        sectionRef={sectionRef}
        lang={lang}
        translationKey="exchange"
        href={`/${lang}/marketplace?exchangeable=true`}
        products={exchange.products}
        loading={!near || exchange.loading}
      />
      <ProductRow
        lang={lang}
        translationKey="forSale"
        href={`/${lang}/marketplace`}
        products={sale.products}
        loading={!near || sale.loading}
      />
    </>
  );
}

interface ProductRowProps {
  sectionRef?: Ref<HTMLElement>;
  lang: SupportedLanguage;
  href: string;
  /** Names the copy block under `marketplace.` for this row. */
  translationKey: "exchange" | "forSale";
  products: readonly Product[];
  loading: boolean;
}

/**
 * One rail with its own heading. An empty row keeps its heading and says so,
 * rather than disappearing: the two rows are the shape of the section, and a
 * home screen that shows one of them on some visits and two on others reads as
 * a bug. This is what the stores sections do with `noStores` / `noProducts`.
 */
function ProductRow({
  sectionRef,
  lang,
  href,
  translationKey,
  products,
  loading,
}: ProductRowProps) {
  const { t } = useTranslation(NAMESPACE);
  const title = t(`marketplace.${translationKey}.title`);

  return (
    <Section ref={sectionRef} ariaLabel={title}>
      <SectionHeader
        align="start"
        title={title}
        subtitle={t(`marketplace.${translationKey}.subtitle`)}
        action={
          <Link
            href={href}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("marketplace.seeAll")}
          </Link>
        }
      />

      <ProductScroller
        items={products}
        loading={loading}
        empty={
          <Text variant="p" size="sm">
            {t(`marketplace.${translationKey}.empty`)}
          </Text>
        }
        renderItem={(product) => <MarketplaceCard product={product} lang={lang} />}
      />
    </Section>
  );
}
