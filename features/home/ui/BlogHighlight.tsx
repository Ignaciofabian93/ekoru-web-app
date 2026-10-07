"use client";
import Link from "next/link";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useBlogCatalog } from "@/features/blog/hooks/useBlogCatalog";
import type { Language } from "@/features/blog/types";
import { NAMESPACE } from "../i18n";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { CardScroller } from "@/components/Cards/CardScroller";
import { Text } from "@/components/Primitives/Text";
import { BlogTopicCard } from "./BlogTopicCard";

const SKELETON_COUNT = 4;

/**
 * Blog topics (the blog catalog categories) as a horizontal rail. Same query
 * and variables as `useCategories`, so Apollo serves it from the cache the
 * categories grid already filled.
 */
export function BlogHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { categories: topics, loading } = useBlogCatalog(
    lang.toUpperCase() as Language,
  );
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    topics.length,
  );

  const pending = loading && topics.length === 0;

  return (
    <Section ariaLabel={t("blog.title")}>
      <SectionHeader
        align="start"
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        action={
          <Link
            href={`/${lang}/blog`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("blog.seeAll")}
          </Link>
        }
      />

      {pending || topics.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("blog.scrollPrevious")}
          scrollNextAriaLabel={t("blog.scrollNext")}
        >
          {pending
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="h-60 w-64 shrink-0 snap-start animate-pulse rounded-2xl bg-background-secondary sm:w-72"
                />
              ))
            : topics.map((topic, i) => (
                <div key={topic.id} className="shrink-0 snap-start">
                  <BlogTopicCard lang={lang} topic={topic} index={i} />
                </div>
              ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("blog.noTopics")}
        </Text>
      )}
    </Section>
  );
}
