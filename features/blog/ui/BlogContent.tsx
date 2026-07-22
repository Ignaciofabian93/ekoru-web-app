"use client";
import { useBlogCatalog } from "../hooks/useBlogCatalog";
import type { Language } from "../types";
import { BlogCatalogList } from "./BlogCatalogList";
import { Layout } from "@/components/Layout/Layout";

interface Props {
  lang: string;
  language: Language;
}

export function BlogContent({ lang, language }: Props) {
  const { categories, loading } = useBlogCatalog(language);

  return (
    <Layout.Section>
      <BlogCatalogList lang={lang} categories={categories} loading={loading} />
    </Layout.Section>
  );
}
