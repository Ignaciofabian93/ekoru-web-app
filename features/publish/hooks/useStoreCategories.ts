"use client";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { GET_STORES_CATALOG } from "@/graphql/stores/queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

// Shape mirrors StoreCatalogItemFields (pre-translated by the stores subgraph
// based on the `language` variable).
type CatalogStoreSubCategory = { id: number; name: string; slug: string; href: string };
type CatalogStoreCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: CatalogStoreSubCategory[];
};

export interface UseStoreCategoriesParams {
  enabled: boolean;
  onLeafChange: (storeSubCategoryId: string) => void;
}

export interface StoreCategoriesState {
  loading: boolean;
  categories: { value: number; label: string }[];
  subCategories: { value: number; label: string }[];
  categoryId: number | null;
  subCategoryId: number | null;
  selectedLeafLabel: string;
  setCategory: (id: number) => void;
  setSubCategory: (id: number) => void;
}

export function useStoreCategories({
  enabled,
  onLeafChange,
}: UseStoreCategoriesParams): StoreCategoriesState {
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data, loading } = useQuery<{ getStoreCatalog: CatalogStoreCategory[] }>(
    GET_STORES_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  const catalog = useMemo(() => data?.getStoreCatalog ?? [], [data]);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);

  const categories = useMemo(
    () => catalog.map((c) => ({ value: c.id, label: c.name })),
    [catalog],
  );

  const currentCategory = useMemo(
    () => (categoryId !== null ? catalog.find((c) => c.id === categoryId) ?? null : null),
    [catalog, categoryId],
  );

  const subCategories = useMemo(
    () =>
      currentCategory
        ? currentCategory.subCategoryItems.map((s) => ({ value: s.id, label: s.name }))
        : [],
    [currentCategory],
  );

  const selectedLeafLabel =
    (subCategoryId !== null &&
      currentCategory?.subCategoryItems.find((s) => s.id === subCategoryId)?.name) ||
    "";

  const setCategory = useCallback(
    (id: number) => {
      setCategoryId(id);
      setSubCategoryId(null);
      onLeafChange("");
    },
    [onLeafChange],
  );

  const setSubCategory = useCallback(
    (id: number) => {
      setSubCategoryId(id);
      onLeafChange(String(id));
    },
    [onLeafChange],
  );

  return {
    loading,
    categories,
    subCategories,
    categoryId,
    subCategoryId,
    selectedLeafLabel,
    setCategory,
    setSubCategory,
  };
}
