"use client";
import clsx from "clsx";
import { Heart, Store as StoreIcon, Wrench } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "@/components/Patterns/Pagination";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import type { ServiceNode } from "@/features/services/types";
import { useTranslation } from "@/i18n/context";
import { useFavorites, type FavoritesTab } from "../hooks/useFavorites";
import { NAMESPACE } from "../i18n";
import { EmptyState } from "@/components/Feedback/EmptyState";
import {
  MarketplaceCard,
  ServiceCard,
  StoreProductCard,
  type ServiceCardService,
} from "@/components/Cards";

const PAGE_SIZE = 12;

const TABS: { key: FavoritesTab; icon: typeof Heart }[] = [
  { key: "products", icon: Heart },
  { key: "stores", icon: StoreIcon },
  { key: "services", icon: Wrench },
];

function toServiceCardService(service: ServiceNode): ServiceCardService {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    image: service.images?.[0],
    category: service.serviceCategory?.subCategory,
    price: service.basePrice,
    duration: service.duration,
    averageRating: service.averageRating,
    reviewsNumber: service.reviewCount,
    isLiked: service.isLiked,
    providerName: service.seller?.profile?.businessName,
    providerLogo: service.seller?.profile?.logo,
  };
}

export function FavoritesGrid() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const [tab, setTab] = useState<FavoritesTab>("products");
  const [page, setPage] = useState(1);
  const { products, storeProducts, services, pageInfo, loading, isEmpty } = useFavorites(
    tab,
    page,
    PAGE_SIZE,
  );

  function selectTab(next: FavoritesTab) {
    setTab(next);
    setPage(1);
  }

  const hasItems = products.length > 0 || storeProducts.length > 0 || services.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ key, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectTab(key)}
              className={clsx(
                "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
              )}
            >
              <Icon size={16} color="currentColor" strokeWidth={2} />
              {t(`favorites.tabs.${key}`)}
            </button>
          );
        })}
      </div>

      {loading && !hasItems ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-3/4 animate-pulse rounded-xl bg-background-secondary"
            />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState
          variant="prominent"
          icon={Heart}
          title={t("favorites.empty.title")}
          description={t("favorites.empty.description")}
          actionLabel={t("favorites.empty.action")}
          onAction={() => router.push(`/${lang}/marketplace`)}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {tab === "products" &&
              products.map((product, i) => (
                <MarketplaceCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  priority={i < 4}
                />
              ))}
            {tab === "stores" &&
              storeProducts.map((product) => (
                <StoreProductCard key={product.id} product={product} lang={lang} />
              ))}
            {tab === "services" &&
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={toServiceCardService(service)}
                  lang={lang}
                />
              ))}
          </div>

          {pageInfo && pageInfo.totalPages > 1 && (
            <Pagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
