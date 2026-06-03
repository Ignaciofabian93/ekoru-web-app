"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useCommunitySubcategory } from "../hooks/useCommunitySubcategory";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";
import { DetailEmptyState } from "./DetailEmptyState";

interface Props {
  lang: string;
  language: Language;
  /** Parent category slug from the route (used for the back link). */
  categorySlug: string;
  /** Subcategory slug from the route. */
  slug: string;
}

export function CommunitySubcategoryContent({ lang, language, categorySlug, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { subcategory, loading } = useCommunitySubcategory(slug, language);
  const translation = subcategory?.translation;

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <Link
        href={`/${lang}/community/${categorySlug}`}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        {t("detail.backToList")}
      </Link>

      {loading && !subcategory ? (
        <div className="flex flex-col gap-3">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
        </div>
      ) : !translation ? (
        <DetailEmptyState title={t("detail.notFound")} hint={t("detail.notFoundHint")} />
      ) : (
        <>
          <header className="flex flex-col gap-2">
            <Title level="h1" size="h3" weight="bold">
              {translation.subCategory}
            </Title>
            {translation.description && (
              <Text color="secondary">{translation.description}</Text>
            )}
          </header>

          <section className="flex flex-col gap-4">
            <Title level="h2" size="h5">
              {t("detail.postsTitle")}
            </Title>
            <DetailEmptyState title={t("detail.noPosts")} hint={t("detail.noPostsHint")} />
          </section>
        </>
      )}
    </div>
  );
}
