"use client";

import type { SupportedLanguage } from "@/constants/settings";

import { useSellerStorefront } from "../hooks/useSellerStorefront";
import { SellerAbout } from "./SellerAbout";
import { SellerCatalog } from "./SellerCatalog";
import { SellerDetails } from "./SellerDetails";
import { SellerHero } from "./SellerHero";
import { SellerStats } from "./SellerStats";
import { SellerErrorState, SellerLoading, SellerNotFound } from "./SellerStatus";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">{children}</div>;
}

export function SellerContent({ id, lang }: Props) {
  const { seller, categories, totalCount, loading, error } = useSellerStorefront({
    sellerId: id,
  });

  if (loading && !seller) {
    return (
      <Container>
        <SellerLoading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SellerErrorState lang={lang} />
      </Container>
    );
  }

  if (!seller) {
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
              productsCount={totalCount}
              categoriesCount={categories.length}
              memberSince={seller.createdAt}
            />
            <SellerAbout seller={seller} />
            <SellerDetails seller={seller} />
          </aside>

          <div className="min-w-0 md:col-span-2">
            <SellerCatalog
              lang={lang}
              categories={categories}
              totalCount={totalCount}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
