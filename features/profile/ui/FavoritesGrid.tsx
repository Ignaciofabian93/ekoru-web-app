"use client";
import clsx from "clsx";
import { Heart, Store as StoreIcon, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Pagination } from "@/components/Pagination/Pagination";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";

import {
  useFavorites,
  type FavoriteCardItem,
  type FavoritesTab,
} from "../hooks/useFavorites";
import { NAMESPACE } from "../i18n";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 12;

const TABS: { key: FavoritesTab; icon: typeof Heart }[] = [
  { key: "products", icon: Heart },
  { key: "stores", icon: StoreIcon },
  { key: "services", icon: Wrench },
];

function hrefFor(item: FavoriteCardItem, lang: string): string {
  // Services have no single-item route yet → fall back to the catalog.
  return item.source === "service"
    ? `/${lang}/services`
    : `/${lang}/product/${item.id}`;
}

export function FavoritesGrid() {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const [tab, setTab] = useState<FavoritesTab>("products");
  const [page, setPage] = useState(1);
  const { items, pageInfo, loading } = useFavorites(tab, page, PAGE_SIZE);
  const { toggleFavorite } = useToggleFavorite();

  function selectTab(next: FavoritesTab) {
    setTab(next);
    setPage(1);
  }

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

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/5 animate-pulse rounded-2xl bg-background-secondary"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t("favorites.empty.title")}
          description={t("favorites.empty.description")}
          actionLabel={t("favorites.empty.action")}
          onAction={() => router.push(`/${lang}/marketplace`)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const cover = resolveImageUrl(item.image);
              return (
                <Link
                  key={`${item.source}-${item.id}`}
                  href={hrefFor(item, lang)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square w-full bg-linear-to-br from-primary-light/15 to-secondary/10">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary/30">
                        <Heart size={48} color="currentColor" strokeWidth={1.5} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(item.id, true, item.source);
                      }}
                      aria-label={t("favorites.card.remove")}
                      className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/95 text-danger shadow-sm transition-transform hover:scale-105"
                    >
                      <Heart
                        size={16}
                        color="currentColor"
                        fill="currentColor"
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <Title level="h3" size="h6" weight="semibold" numberOfLines={1}>
                      {item.name}
                    </Title>
                    {item.subtitle && (
                      <Text variant="span" size="sm" color="tertiary">
                        {item.subtitle}
                      </Text>
                    )}
                    {typeof item.price === "number" && (
                      <div className="mt-1.5">
                        <Text variant="span" weight="bold" size="lg" color="primary">
                          {formatPrice(item.price)}
                        </Text>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
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
