"use client";
import { useCommunityCatalog } from "../hooks/useCommunityCatalog";
import type { Language } from "../types";
import { CommunityCatalogList } from "./CommunityCatalogList";
import { Layout } from "@/components/Layout/Layout";

interface Props {
  lang: string;
  language: Language;
}

export function CommunityContent({ lang, language }: Props) {
  const { categories, loading } = useCommunityCatalog(language);

  return (
    <Layout.Section>
      <CommunityCatalogList lang={lang} categories={categories} loading={loading} />
    </Layout.Section>
  );
}
