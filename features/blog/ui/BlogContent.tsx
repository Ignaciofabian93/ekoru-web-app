"use client";
import { useBlogCatalog } from "../hooks/useBlogCatalog";
import type { Language } from "../types";
import { BlogCatalogList } from "./BlogCatalogList";

interface Props {
  lang: string;
  language: Language;
}

export function BlogContent({ lang, language }: Props) {
  const { categories, loading } = useBlogCatalog(language);

  return (
    <div className="flex flex-col gap-8">
      <BlogCatalogList lang={lang} categories={categories} loading={loading} />
    </div>
  );
}
