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
  /**
   * Pre-selects the whole department → category → type chain from an existing
   * leaf, for editing a listing that already has a category. Applied once, when
   * the catalog first arrives; the seller's own choices are never overwritten.
   */
  initialProductCategoryId?: number | null;
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
  initialProductCategoryId = null,
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

  const [pickedDepartmentId, setDepartmentId] = useState<number | null>(null);
  const [pickedDepartmentCategoryId, setDepartmentCategoryId] = useState<number | null>(
    null,
  );
  const [pickedProductCategoryId, setProductCategoryId] = useState<number | null>(null);
  // Until the seller touches a select, the selection shown is the seed. After
  // that their own picks win outright — including deliberately empty ones,
  // which is why this is a flag rather than a `?? seed` fallback per level.
  const [touched, setTouched] = useState(false);

  const departments = useMemo(
    () => catalog.map((d) => ({ value: d.id, label: d.name })),
    [catalog],
  );

  // Walk the catalog back up from the leaf to recover the whole chain. Derived
  // during render rather than pushed into state by an effect, so there's no
  // cascading re-render and nothing to keep in sync.
  const seed = useMemo(() => {
    // Flattened to department/category pairs so this stays one expression with
    // no mid-loop returns — the React Compiler can't preserve a memo built from
    // those, and the lint config treats a skipped memo as an error.
    const match = catalog
      .flatMap((department) =>
        department.categories.flatMap((category) =>
          category.productCategories.map((leaf) => ({ department, category, leaf })),
        ),
      )
      .find(({ leaf }) => leaf.id === initialProductCategoryId);

    // No match also covers a leaf missing from the catalog (a deactivated
    // category, say) — the selects start empty and the seller re-picks.
    return match
      ? {
          departmentId: match.department.id,
          departmentCategoryId: match.category.id,
          productCategoryId: match.leaf.id,
        }
      : null;
  }, [catalog, initialProductCategoryId]);

  const departmentId = touched ? pickedDepartmentId : (seed?.departmentId ?? null);
  const departmentCategoryId = touched
    ? pickedDepartmentCategoryId
    : (seed?.departmentCategoryId ?? null);
  const productCategoryId = touched
    ? pickedProductCategoryId
    : (seed?.productCategoryId ?? null);

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
      setTouched(true);
      setDepartmentId(id);
      setDepartmentCategoryId(null);
      setProductCategoryId(null);
      onLeafChange("");
    },
    [onLeafChange],
  );

  // Changing a select below the top one is the first touch in the common edit
  // case ("same department, different type"). The seed's ancestors have to be
  // promoted into state at that moment, or switching to `touched` would blank
  // the parent selects the seller never went near.
  const setDepartmentCategory = useCallback(
    (id: number) => {
      if (!touched && seed) setDepartmentId(seed.departmentId);
      setTouched(true);
      setDepartmentCategoryId(id);
      setProductCategoryId(null);
      onLeafChange("");
    },
    [onLeafChange, seed, touched],
  );

  const setProductCategory = useCallback(
    (id: number) => {
      if (!touched && seed) {
        setDepartmentId(seed.departmentId);
        setDepartmentCategoryId(seed.departmentCategoryId);
      }
      setTouched(true);
      setProductCategoryId(id);
      onLeafChange(String(id));
    },
    [onLeafChange, seed, touched],
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
