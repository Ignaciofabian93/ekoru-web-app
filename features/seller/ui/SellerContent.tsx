"use client";

import type { SupportedLanguage } from "@/constants/settings";

import { useMarketplaceCatalog } from "../hooks/useMarketplaceCatalog";
import { useStoreCatalog } from "../hooks/useStoreCatalog";
import { resolveSellerKind } from "../sellerDisplay";
import { SellerAbout } from "./SellerAbout";
import { SellerBusinessInfo } from "./SellerBusinessInfo";
import { SellerCatalog } from "./SellerCatalog";
import { SellerDetails } from "./SellerDetails";
import { SellerHero } from "./SellerHero";
import { SellerStats } from "./SellerStats";
import { SellerStoreCatalog } from "./SellerStoreCatalog";
import { SellerErrorState, SellerLoading, SellerNotFound } from "./SellerStatus";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">{children}</div>;
}

export function SellerContent({ id, lang }: Props) {
  // Identity comes from the public product→seller relation, not the auth-gated
  // `getSeller` query. A seller is either a PERSON (marketplace products) or a
  // business (store products), so exactly one of these carries the seller.
  const marketplace = useMarketplaceCatalog({ sellerId: id });
  const store = useStoreCatalog({ sellerId: id });

  const seller = store.seller ?? marketplace.seller;
  const isBusiness = resolveSellerKind(seller?.sellerType) === "business";
  const catalog = isBusiness ? store : marketplace;

  const loading = marketplace.loading || store.loading;

  if (loading && !seller) {
    return (
      <Container>
        <SellerLoading />
      </Container>
    );
  }

  if (!seller) {
    // Both catalogs settled with no seller: a hard error on both is an error
    // state; otherwise the id simply doesn't resolve to a visible seller.
    if (marketplace.error && store.error) {
      return (
        <Container>
          <SellerErrorState lang={lang} />
        </Container>
      );
    }
    return (
      <Container>
        <SellerNotFound lang={lang} />
      </Container>
    );
  }

  return (
    <>
      <SellerHero seller={seller} lang={lang} />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <div className="mt-2 grid gap-6 md:mt-6 md:grid-cols-3 md:gap-8">
          <aside className="flex min-w-0 flex-col gap-6 md:col-span-1">
            <SellerStats
              productsCount={catalog.totalCount}
              categoriesCount={catalog.categories.length}
              memberSince={seller.createdAt}
            />
            <SellerAbout seller={seller} />
            <SellerDetails seller={seller} />
            {isBusiness && <SellerBusinessInfo seller={seller} />}
          </aside>

          <div className="min-w-0 md:col-span-2">
            {isBusiness ? (
              <SellerStoreCatalog
                lang={lang}
                categories={store.categories}
                totalCount={store.totalCount}
                loading={store.loading}
              />
            ) : (
              <SellerCatalog
                lang={lang}
                categories={marketplace.categories}
                totalCount={marketplace.totalCount}
                loading={marketplace.loading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
