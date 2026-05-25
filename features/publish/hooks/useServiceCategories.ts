"use client";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { GET_SERVICES_CATALOG } from "@/graphql/services/queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

// Shape mirrors ServiceCatalogItemFields (pre-translated by the services
// subgraph based on the `language` variable).
type CatalogServiceSubCategory = { id: number; name: string; slug: string; href: string };
type CatalogServiceCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: CatalogServiceSubCategory[];
};

export interface UseServiceCategoriesParams {
  enabled: boolean;
  onLeafChange: (serviceSubcategoryId: string) => void;
}

export interface ServiceCategoriesState {
  loading: boolean;
  categories: { value: number; label: string }[];
  subCategories: { value: number; label: string }[];
  categoryId: number | null;
  subCategoryId: number | null;
  selectedLeafLabel: string;
  setCategory: (id: number) => void;
  setSubCategory: (id: number) => void;
}

export function useServiceCategories({
  enabled,
  onLeafChange,
}: UseServiceCategoriesParams): ServiceCategoriesState {
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data, loading } = useQuery<{ getServiceCatalog: CatalogServiceCategory[] }>(
    GET_SERVICES_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  const catalog = useMemo(() => data?.getServiceCatalog ?? [], [data]);

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
