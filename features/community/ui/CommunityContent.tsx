"use client";
import { useTranslation } from "@/i18n/context";
import { useCategoryParam } from "@/hooks/useCategoryParam";
import { resolveCommunityCategoryIcon } from "../constants/icons";
import { useCommunityCatalog } from "../hooks/useCommunityCatalog";
import { useCommunityEventCounts } from "../hooks/useCommunityEventCounts";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { CommunityEvents } from "./CommunityEvents";
import { Section } from "@/components/Layout";
import { CategoryFilter } from "@/components/Patterns/CategoryFilter";
import { CategoryRow, type CategoryRowItem } from "@/components/Patterns/CategoryRow";

interface Props {
  lang: string;
  language: Language;
}

export function CommunityContent({ lang, language }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { categories, loading } = useCommunityCatalog(language);
  const { category: categorySlug, setCategory } = useCategoryParam();

  const activeCategory = categories.find((cat) => cat.slug === categorySlug);
  // A shared ?category= link waits for the catalog instead of listing every
  // event first.
  const waiting = Boolean(categorySlug) && loading && !activeCategory;

  // The tiles only show on the root page, with every category.
  const isRoot = !categorySlug;
  const { counts, loading: countsLoading } = useCommunityEventCounts({ skip: !isRoot });
  const eventCountLabel = (count: number) =>
    count === 0
      ? t("sections.eventCountNone")
      : t(count === 1 ? "sections.eventCount" : "sections.eventCountPlural", {
          count: String(count),
        });
  const categoryItems: CategoryRowItem[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.category,
    href: `/${lang}/community/${cat.slug}`,
    Icon: resolveCommunityCategoryIcon(cat.id),
    caption: counts ? eventCountLabel(counts.get(cat.id) ?? 0) : undefined,
  }));

  return (
    <Section>
      <div className="flex flex-col gap-10">
        <CategoryFilter
          title={t("sections.categories")}
          allLabel={t("sections.allCategories")}
          categories={categories.map((cat) => ({ slug: cat.slug, name: cat.category }))}
          activeSlug={categorySlug}
          onSelect={setCategory}
          loading={loading}
          remeasureKey={lang}
        />
        {isRoot && (
          <CategoryRow
            title={t("sections.browse")}
            items={categoryItems}
            loading={loading || countsLoading}
            scrollPreviousLabel={t("scroll.previous")}
            scrollNextLabel={t("scroll.next")}
          />
        )}
        {!waiting && (
          // Keyed so a category switch starts the list (and its paging) over.
          <CommunityEvents
            key={activeCategory?.id ?? "all"}
            scope={activeCategory ? { communityCategoryId: activeCategory.id } : {}}
          />
        )}
      </div>
    </Section>
  );
}
