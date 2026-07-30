"use client";
import { useBlogCatalog } from "../hooks/useBlogCatalog";
import type { Language } from "../types";
import { BlogCatalogList } from "./BlogCatalogList";
import { Section } from "@/components/Layout";

interface Props {
  lang: string;
  language: Language;
}

export function BlogContent({ lang, language }: Props) {
  const { categories, loading } = useBlogCatalog(language);

  return (
    <Section>
      <BlogCatalogList lang={lang} categories={categories} loading={loading} />
    </Section>
  );
}
