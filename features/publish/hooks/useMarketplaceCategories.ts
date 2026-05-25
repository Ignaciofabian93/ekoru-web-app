"use client";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { GET_MARKETPLACE_CATALOG } from "@/graphql/marketplace/queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

// Shape mirrors CATALOG_ITEM_FIELDS_FRAGMENT (already pre-translated by the
// marketplace subgraph based on the `language` variable).
type CatalogProductCategory = { id: number; name: string; slug: string; href: string };
type CatalogDepartmentCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
  productCategories: CatalogProductCategory[];
};
type CatalogDepartment = {
  id: number;
  name: string;
  slug: string;
  href: string;
  categories: CatalogDepartmentCategory[];
};

export interface UseMarketplaceCategoriesParams {
  enabled: boolean;
  onLeafChange: (productCategoryId: string) => void;
}

export interface MarketplaceCategoriesState {
  loading: boolean;
  departments: { value: number; label: string }[];
  departmentCategories: { value: number; label: string }[];
  productCategories: { value: number; label: string }[];
  departmentId: number | null;
  departmentCategoryId: number | null;
  productCategoryId: number | null;
  selectedLeafLabel: string;
  setDepartment: (id: number) => void;
  setDepartmentCategory: (id: number) => void;
  setProductCategory: (id: number) => void;
}

export function useMarketplaceCategories({
  enabled,
  onLeafChange,
}: UseMarketplaceCategoriesParams): MarketplaceCategoriesState {
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data, loading } = useQuery<{ getMarketplaceCatalog: CatalogDepartment[] }>(
    GET_MARKETPLACE_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  const catalog = useMemo(() => data?.getMarketplaceCatalog ?? [], [data]);

  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [departmentCategoryId, setDepartmentCategoryId] = useState<number | null>(null);
  const [productCategoryId, setProductCategoryId] = useState<number | null>(null);

  const departments = useMemo(
    () => catalog.map((d) => ({ value: d.id, label: d.name })),
    [catalog],
  );

  const currentDepartment = useMemo(
    () => (departmentId !== null ? catalog.find((d) => d.id === departmentId) ?? null : null),
    [catalog, departmentId],
  );

  const departmentCategories = useMemo(
    () =>
      currentDepartment
        ? currentDepartment.categories.map((c) => ({ value: c.id, label: c.name }))
        : [],
    [currentDepartment],
  );

  const currentDepartmentCategory = useMemo(
    () =>
      currentDepartment && departmentCategoryId !== null
        ? currentDepartment.categories.find((c) => c.id === departmentCategoryId) ?? null
        : null,
    [currentDepartment, departmentCategoryId],
  );

  const productCategories = useMemo(
    () =>
      currentDepartmentCategory
        ? currentDepartmentCategory.productCategories.map((p) => ({
            value: p.id,
            label: p.name,
          }))
        : [],
    [currentDepartmentCategory],
  );

  const selectedLeafLabel =
    (productCategoryId !== null &&
      currentDepartmentCategory?.productCategories.find((p) => p.id === productCategoryId)
        ?.name) ||
    "";

  const setDepartment = useCallback(
    (id: number) => {
      setDepartmentId(id);
      setDepartmentCategoryId(null);
      setProductCategoryId(null);
      onLeafChange("");
    },
    [onLeafChange],
  );

  const setDepartmentCategory = useCallback(
    (id: number) => {
      setDepartmentCategoryId(id);
      setProductCategoryId(null);
      onLeafChange("");
    },
    [onLeafChange],
  );

  const setProductCategory = useCallback(
    (id: number) => {
      setProductCategoryId(id);
      onLeafChange(String(id));
    },
    [onLeafChange],
  );

  return {
    loading,
    departments,
    departmentCategories,
    productCategories,
    departmentId,
    departmentCategoryId,
    productCategoryId,
    selectedLeafLabel,
    setDepartment,
    setDepartmentCategory,
    setProductCategory,
  };
}
