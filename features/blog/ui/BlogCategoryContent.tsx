"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useBlogCategory } from "../hooks/useBlogCategory";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";

interface Props {
  lang: string;
  language: Language;
  slug: string;
}

export function BlogCategoryContent({ lang, language, slug }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { category, loading } = useBlogCategory(slug, language);
  const translation = category?.translation;

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <Link
        href={`/${lang}/blog`}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        {t("detail.backToList")}
      </Link>

      {loading && !category ? (
        <div className="flex flex-col gap-3">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-background-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-background-secondary" />
        </div>
      ) : !translation ? (
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-surface px-4 py-12 text-center">
          <Text weight="semibold">{t("detail.notFound")}</Text>
          <Text size="sm" color="secondary">
            {t("detail.notFoundHint")}
          </Text>
        </div>
      ) : (
        <>
          <header className="flex flex-col gap-2">
            <Title level="h1" size="h3" weight="bold">
              {translation.name}
            </Title>
            {translation.description && (
              <Text color="secondary">{translation.description}</Text>
            )}
          </header>

          <section className="flex flex-col gap-4">
            <Title level="h2" size="h5">
              {t("detail.postsTitle")}
            </Title>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-surface px-4 py-12 text-center">
              <Text weight="semibold">{t("detail.noPosts")}</Text>
              <Text size="sm" color="secondary">
                {t("detail.noPostsHint")}
              </Text>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
