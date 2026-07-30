"use client";
import {
  ArrowUpRight,
  BookOpen,
  Package2,
  Store,
  UsersRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useCategories } from "../hooks/useCategories";
import type { SupportedLanguage } from "@/constants/settings";
import { Text } from "@/components/Primitives/Text";
import { Grid, Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";

type SectionId = "marketplace" | "stores" | "services" | "community" | "blog";

interface SectionCard {
  id: SectionId;
  Icon: React.ElementType;
  href: string;
  gradient: string;
  span: string;
  loading: boolean;
  categories: { id: number; name: string; slug: string }[];
}

const SKELETON_WIDTHS = [72, 56, 88, 64, 76];

export function CategoriesSection({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const {
    marketplace,
    marketplaceLoading,
    stores,
    storeLoading,
    services,
    serviceLoading,
    community,
    communityLoading,
    blog,
    blogLoading,
  } = useCategories({ language: lang });

  const sections: SectionCard[] = [
    {
      id: "marketplace",
      Icon: Package2,
      href: "/marketplace",
      gradient: "from-green-800 via-green-700 to-primary",
      span: "sm:col-span-2 lg:col-span-3",
      loading: marketplaceLoading,
      categories:
        marketplace?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) ?? [],
    },
    {
      id: "stores",
      Icon: Store,
      href: "/stores",
      gradient: "from-sky-700 to-sky-500",
      span: "lg:col-span-3",
      loading: storeLoading,
      categories: stores?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) ?? [],
    },
    {
      id: "services",
      Icon: Wrench,
      href: "/services",
      gradient: "from-amber-800 to-amber-500",
      span: "lg:col-span-2",
      loading: serviceLoading,
      categories: services?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) ?? [],
    },
    {
      id: "community",
      Icon: UsersRound,
      href: "/community",
      gradient: "from-violet-800 to-violet-500",
      span: "lg:col-span-2",
      loading: communityLoading,
      categories:
        community?.map((c) => ({ id: c.id, name: c.category, slug: c.slug })) ?? [],
    },
    {
      id: "blog",
      Icon: BookOpen,
      href: "/blog",
      gradient: "from-teal-800 to-teal-500",
      span: "lg:col-span-2",
      loading: blogLoading,
      categories: blog?.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) ?? [],
    },
  ];

  return (
    <Section ariaLabel={t("categories.title")}>
      <SectionHeader title={t("categories.title")} subtitle={t("categories.subtitle")} />

      <Grid cols={1} sm={2} lg={6} gap={3}>
        {sections.map(({ id, Icon, href, gradient, span, loading, categories }) => (
          <div
            key={id}
            className={`relative bg-linear-to-br ${gradient} rounded-2xl overflow-hidden p-4 shadow-md flex flex-col ${span}`}
          >
            <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-14 -right-14 pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-white/10 -bottom-8 -left-8 pointer-events-none" />

            <div className="relative flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon size={20} color="#fff" strokeWidth={1.5} />
              </div>
              <Link
                href={`/${lang}${href}`}
                aria-label={t(`categories.items.${id}.title`)}
                className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ArrowUpRight size={17} color="#fff" strokeWidth={2.5} />
              </Link>
            </div>

            <Text variant="p" color="white" weight="bold" size="lg">
              {t(`categories.items.${id}.title`)}
            </Text>
            <Text variant="p" color="white" weight="semibold" size="sm" className="mb-6">
              {t(`categories.items.${id}.description`)}
            </Text>

            <div className="relative flex flex-wrap gap-1.5 mt-auto">
              {loading && categories.length === 0
                ? SKELETON_WIDTHS.map((width, i) => (
                    <span
                      key={i}
                      className="h-6.5 rounded-full bg-white/15 animate-pulse"
                      style={{ width }}
                    />
                  ))
                : categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/${lang}${href}/${cat.slug}`}
                      className="bg-white/15 border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
            </div>
          </div>
        ))}
      </Grid>
    </Section>
  );
}
