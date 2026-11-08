"use client";
import { useTranslation } from "@/i18n/context";
import { useCategoryParam } from "@/hooks/useCategoryParam";
import { useCommunityCatalog } from "../hooks/useCommunityCatalog";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { CommunityEvents } from "./CommunityEvents";
import { Section } from "@/components/Layout";
import { CategoryFilter } from "@/components/Patterns/CategoryFilter";

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
