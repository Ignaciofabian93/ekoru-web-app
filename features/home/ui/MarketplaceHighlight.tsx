"use client";
import Link from "next/link";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useCardScroller } from "@/hooks/useCardScroller";
import {
  useExchangeableProducts,
  useSaleProducts,
} from "../hooks/useMarketplaceProducts";
import { NAMESPACE } from "../i18n";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { CardScroller } from "@/components/Cards/CardScroller";
import { MarketplaceCard } from "@/components/Cards";
import { Text } from "@/components/Primitives/Text";
import type { Product } from "@/types/product";

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
  const exchange = useExchangeableProducts({ pageSize: PAGE_SIZE });
  const sale = useSaleProducts({ pageSize: PAGE_SIZE });

  return (
    <>
      <ProductRow
        lang={lang}
        translationKey="exchange"
        href={`/${lang}/marketplace?exchangeable=true`}
        products={exchange.products}
        loading={exchange.loading}
      />
      <ProductRow
        lang={lang}
        translationKey="forSale"
        href={`/${lang}/marketplace`}
        products={sale.products}
        loading={sale.loading}
      />
    </>
  );
}

interface ProductRowProps {
  lang: SupportedLanguage;
  href: string;
  /** Names the copy block under `marketplace.` for this row. */
  translationKey: "exchange" | "forSale";
  products: readonly Product[];
  loading: boolean;
}

/**
 * One rail with its own heading. Each row owns a `useCardScroller` instance —
 * the two rails scroll independently, so the ref and the arrow state cannot be
 * hoisted into the parent.
 *
 * An empty row keeps its heading and says so, rather than disappearing: the two
 * rows are the shape of the section, and a home screen that shows one of them
 * on some visits and two on others reads as a bug. This is what the stores
 * sections do with `noStores` / `noProducts`.
 */
function ProductRow({ lang, href, translationKey, products, loading }: ProductRowProps) {
  const { t } = useTranslation(NAMESPACE);
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    products.length,
  );

  const title = t(`marketplace.${translationKey}.title`);
  const pending = loading && products.length === 0;

  return (
    <Section ariaLabel={title}>
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

      {pending || products.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("marketplace.scrollPrevious")}
          scrollNextAriaLabel={t("marketplace.scrollNext")}
        >
          {pending
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 w-44 shrink-0 snap-start animate-pulse rounded-lg bg-background-secondary"
                />
              ))
            : products.map((product, i) => (
                <div key={product.id} className="w-44 shrink-0 snap-start">
                  <MarketplaceCard priority={i < 4} product={product} lang={lang} />
                </div>
              ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t(`marketplace.${translationKey}.empty`)}
        </Text>
      )}
    </Section>
  );
}
