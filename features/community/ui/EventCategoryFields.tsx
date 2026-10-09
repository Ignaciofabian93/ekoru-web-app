"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { Select, type Option } from "@/components/Primitives/Select";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

import { useCommunityCatalog } from "../hooks/useCommunityCatalog";
import type { EventDraft } from "../hooks/useCommunityEvents";
import { NAMESPACE } from "../i18n";
import type { Language } from "../types";

type Props = {
  draft: EventDraft;
  onChange: <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => void;
};

/**
 * What kind of event it is: a community category, then one of its
 * subcategories. The subcategory decides which /community page lists it.
 */
export function EventCategoryFields({ draft, onChange }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const language = (params.lang ?? DEFAULT_LANGUAGE).toUpperCase() as Language;
  const { categories } = useCommunityCatalog(language);

  // A preset subcategory (subcategory page) implies its category.
  const categoryId = useMemo(
    () =>
      draft.communityCategoryId ??
      categories.find((c) =>
        c.subcategories.some((s) => s.id === draft.communitySubCategoryId),
      )?.id,
    [categories, draft.communityCategoryId, draft.communitySubCategoryId],
  );

  const categoryOptions: Option[] = categories.map((c) => ({
    value: c.id,
    label: c.category,
  }));
  const subcategoryOptions: Option[] = (
    categories.find((c) => c.id === categoryId)?.subcategories ?? []
  ).map((s) => ({ value: s.id, label: s.subcategory }));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select
        label={t("events.create.category")}
        options={categoryOptions}
        value={categoryId}
        onChange={(v) => {
          onChange("communityCategoryId", Number(v));
          onChange("communitySubCategoryId", undefined);
        }}
      />
      <Select
        label={t("events.create.subcategory")}
        options={subcategoryOptions}
        value={draft.communitySubCategoryId}
        disabled={categoryId === undefined}
        onChange={(v) => onChange("communitySubCategoryId", Number(v))}
      />
    </div>
  );
}
