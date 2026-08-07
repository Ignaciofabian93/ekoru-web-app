"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useMarketplaceCatalog } from "../hooks/useMarketplaceCatalog";
import { useSellerProfile } from "../hooks/useSellerProfile";
import { useStoreCatalog } from "../hooks/useStoreCatalog";
import { NAMESPACE } from "../i18n";
import { resolveSellerKind } from "../sellerDisplay";
import { SellerAbout } from "./SellerAbout";
import { SellerBusinessInfo } from "./SellerBusinessInfo";
import { SellerCatalog } from "./SellerCatalog";
import { SellerDetails } from "./SellerDetails";
import { SellerHero } from "./SellerHero";
import { SellerStats } from "./SellerStats";
import {
  SellerAuthRequired,
  SellerErrorState,
  SellerLoading,
  SellerNotFound,
} from "./SellerStatus";
import { MarketplaceCard, StoreProductCard } from "@/components/Cards";
import { Container, RHYTHM, Section, Stack } from "@/components/Layout";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export function SellerContent({ id, lang }: Props) {
  const { t } = useTranslation(NAMESPACE);

  // 1) Identity — independent of the catalog, so a seller with no products still
  //    resolves rather than 404'ing.
  const {
    seller,
    loading: profileLoading,
    error: profileError,
    requiresAuth,
  } = useSellerProfile({
    sellerId: id,
    lang,
  });

  const isBusiness = resolveSellerKind(seller?.sellerType) === "business";

  // 2) Catalog — the seller kind decides which product query runs. Both hooks are
  //    called (rules of hooks) but Apollo skips the one that doesn't apply.
  const marketplace = useMarketplaceCatalog({
    sellerId: id,
    enabled: Boolean(seller) && !isBusiness,
  });
  const store = useStoreCatalog({
    sellerId: id,
    enabled: Boolean(seller) && isBusiness,
  });

  const catalog = isBusiness ? store : marketplace;

  if (profileLoading && !seller) {
    return (
      <Container width="default">
        <SellerLoading />
      </Container>
    );
  }

  // Checked before the generic error: signing in is the one action that
  // resolves this, so it gets its own screen.
  if (requiresAuth) {
    return (
      <Container width="default">
        <SellerAuthRequired lang={lang} />
      </Container>
    );
  }

  if (profileError) {
    return (
      <Container width="default">
        <SellerErrorState lang={lang} />
      </Container>
    );
  }

  if (!seller) {
    return (
      <Container width="default">
        <SellerNotFound lang={lang} />
      </Container>
    );
  }

  return (
    <>
      <SellerHero seller={seller} lang={lang} />
      <Container width="default" gap={RHYTHM.SECTION}>
        {/* Who this seller is: the figures, then the two prose panels. */}
        <Section gap={RHYTHM.CONTENT} ariaLabel={t("about.title")}>
          <SellerStats
            productsCount={catalog.totalCount}
            categoriesCount={catalog.categories.length}
            memberSince={seller.createdAt}
          />
          {/* Details is the shorter column, so it takes the narrower track and
              the bio gets the room it needs instead of both being half-width. */}
          <div className="grid gap-6 md:grid-cols-5 md:gap-8">
            <Stack className="md:col-span-3">
              <SellerAbout seller={seller} />
            </Stack>
            <Stack className="md:col-span-2">
              <SellerDetails seller={seller} />
            </Stack>
          </div>
        </Section>

        {isBusiness && <SellerBusinessInfo seller={seller} />}

        {/* Catalog — full-width grid below */}
        {isBusiness ? (
          <SellerCatalog
            title={t("storeCatalog.title")}
            subtitle={t("storeCatalog.subtitle")}
            emptyTitle={t("storeCatalog.empty")}
            emptyHint={t("storeCatalog.emptyHint")}
            products={store.products}
            loading={store.loading}
            getKey={(p) => p.id}
            renderProduct={(p) => <StoreProductCard product={p} lang={lang} />}
          />
        ) : (
          <SellerCatalog
            title={t("catalog.title")}
            subtitle={t("catalog.subtitle")}
            emptyTitle={t("catalog.empty")}
            emptyHint={t("catalog.emptyHint")}
            products={marketplace.products}
            loading={marketplace.loading}
            getKey={(p) => p.id}
            renderProduct={(p) => <MarketplaceCard product={p} lang={lang} />}
          />
        )}
      </Container>
    </>
  );
}
