"use client";
import { Tabs, type Tab } from "@/components/Patterns/Tabs";
import { Title } from "@/components/Primitives/Title";
import {
  categoryFilterClass,
  categoryFilterSkeletonClass,
  categoryFilterSkeletonItemClass,
} from "@/design/category-filter";

const ALL_KEY = "__all__";

export interface CategoryFilterItem {
  slug: string;
  name: string;
}

export interface CategoryFilterProps {
  title: string;
  /** Label of the first tab, which clears the filter. */
  allLabel: string;
  categories: CategoryFilterItem[];
  /** Slug of the selected category; null (or an unknown slug) selects "all". */
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  loading?: boolean;
  /** Bump when labels change width outside `categories` (e.g. language). */
  remeasureKey?: string | number;
}

/**
 * The category row of the browse pages. Selecting a tab filters the page in
 * place instead of opening the category page, so the row stays put and the
 * results below it change.
 */
export function CategoryFilter({
  title,
  allLabel,
  categories,
  activeSlug,
  onSelect,
  loading,
  remeasureKey,
}: CategoryFilterProps) {
  if (loading && categories.length === 0) {
    return (
      <section className={categoryFilterClass}>
        <Title level="h2" size="h5">
          {title}
        </Title>
        <div className={categoryFilterSkeletonClass}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={categoryFilterSkeletonItemClass} />
          ))}
        </div>
      </section>
    );
  }

  const tabs: Tab[] = [
    { key: ALL_KEY, label: allLabel },
    ...categories.map((cat) => ({ key: cat.slug, label: cat.name })),
  ];
  const active =
    activeSlug && categories.some((cat) => cat.slug === activeSlug)
      ? activeSlug
      : ALL_KEY;

  return (
    <section className={categoryFilterClass}>
      <Title level="h2" size="h5">
        {title}
      </Title>
      <Tabs
        tabs={tabs}
        activeKey={active}
        onSelect={(key) => onSelect(key === ALL_KEY ? null : key)}
        ariaLabel={title}
        remeasureKey={remeasureKey}
        scrollable
      />
    </section>
  );
}
