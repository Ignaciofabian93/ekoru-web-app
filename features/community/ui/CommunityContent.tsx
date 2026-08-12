"use client";
import { useCommunityCatalog } from "../hooks/useCommunityCatalog";
import type { Language } from "../types";
import { CommunityCatalogList } from "./CommunityCatalogList";
import { CommunityEvents } from "./CommunityEvents";
import { Section } from "@/components/Layout";

interface Props {
  lang: string;
  language: Language;
}

export function CommunityContent({ lang, language }: Props) {
  const { categories, loading } = useCommunityCatalog(language);

  return (
    <Section>
      <div className="flex flex-col gap-10">
        <CommunityCatalogList lang={lang} categories={categories} loading={loading} />
        <CommunityEvents />
      </div>
    </Section>
  );
}
