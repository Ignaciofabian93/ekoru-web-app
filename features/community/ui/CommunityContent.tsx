"use client";
import { useCommunityCatalog } from "../hooks/useCommunityCatalog";
import type { Language } from "../types";
import { CommunityCatalogList } from "./CommunityCatalogList";

interface Props {
  lang: string;
  language: Language;
}

export function CommunityContent({ lang, language }: Props) {
  const { categories, loading } = useCommunityCatalog(language);

  return (
    <div className="flex flex-col gap-8">
      <CommunityCatalogList lang={lang} categories={categories} loading={loading} />
    </div>
  );
}
