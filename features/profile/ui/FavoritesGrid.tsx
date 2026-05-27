"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import clsx from "clsx";
import { Heart, Store as StoreIcon, Wrench } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { NAMESPACE } from "../i18n";
import { EmptyState } from "./EmptyState";

type Tab = "products" | "stores" | "services";

interface FavoriteItem {
  id: string;
  name: string;
  subtitle?: string;
  price?: number;
  currency?: string;
  image?: string;
  badge?: string;
}

const MOCK_FAVORITES: Record<Tab, FavoriteItem[]> = {
  products: [
    {
      id: "p1",
      name: "Bamboo cutlery set",
      subtitle: "Eco Home",
      price: 8990,
      currency: "CLP",
      badge: "Sustainable",
    },
    {
      id: "p2",
      name: "Wool throw blanket",
      subtitle: "Casa del Lago",
      price: 24990,
      currency: "CLP",
    },
    {
      id: "p3",
      name: "Refurbished record player",
      subtitle: "VinylWorks",
      price: 64990,
      currency: "CLP",
      badge: "Refurbished",
    },
    {
      id: "p4",
      name: "Upcycled denim tote",
      subtitle: "Reborn",
      price: 14990,
      currency: "CLP",
    },
  ],
  stores: [
    { id: "s1", name: "Eco Home", subtitle: "Santiago · 4.8★" },
    { id: "s2", name: "VinylWorks", subtitle: "Valparaíso · 4.9★" },
  ],
  services: [
    { id: "v1", name: "Bike tune-up", subtitle: "By Pedro · From CLP 15.000" },
  ],
};

const TABS: { key: Tab; icon: typeof Heart }[] = [
  { key: "products", icon: Heart },
  { key: "stores", icon: StoreIcon },
  { key: "services", icon: Wrench },
];

function formatMoney(value: number, currency: string, lang: string) {
  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString(lang)}`;
  }
}

export function FavoritesGrid() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const [tab, setTab] = useState<Tab>("products");
  // TODO(favorites): replace mocks with GET_FAVORITES query when backend exists.
  const items = MOCK_FAVORITES[tab];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tabItem) => {
          const active = tab === tabItem.key;
          const Icon = tabItem.icon;
          return (
            <button
              key={tabItem.key}
              type="button"
              onClick={() => setTab(tabItem.key)}
              className={clsx(
                "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
              )}
            >
              <Icon size={16} color="currentColor" strokeWidth={2} />
              {t(`favorites.tabs.${tabItem.key}`)}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t("favorites.empty.title")}
          description={t("favorites.empty.description")}
          actionLabel={t("favorites.empty.action")}
          onAction={() => router.push(`/${lang}/marketplace`)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square w-full bg-gradient-to-br from-primary-light/15 to-secondary/10">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary/30">
                    <Heart size={48} color="currentColor" strokeWidth={1.5} />
                  </div>
                )}
                <button
                  type="button"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-danger shadow-sm transition-transform hover:scale-105"
                  aria-label={t("favorites.card.remove")}
                >
                  <Heart size={16} color="currentColor" fill="currentColor" strokeWidth={2} />
                </button>
                {item.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-success/95 px-2.5 py-1 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
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
                {typeof item.price === "number" && item.currency && (
                  <div className="mt-1.5">
                    <Text variant="span" weight="bold" size="lg" color="primary">
                      {formatMoney(item.price, item.currency, lang)}
                    </Text>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
