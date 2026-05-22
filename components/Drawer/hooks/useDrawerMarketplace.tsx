import { GET_MARKETPLACE_CATALOG } from "@/graphql/marketplace/queries";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { useParams } from "next/navigation";

// Mirrors the MarketplaceCatalogItem GraphQL type from CATALOG_ITEM_FIELDS_FRAGMENT
type CatalogProductCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
  productCategories: CatalogProductCategory[];
};

type CatalogItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
  categories: CatalogCategory[];
};

type L3Item = { label: string; route: string };
type L2Item = { label: string; route: string; children?: L3Item[] };
export type L1Item = { label: string; route: string; children?: L2Item[] };

// Maps the flat catalog response into the L1 > L2 > L3 accordion structure:
//   Department > DepartmentCategory > ProductCategory
function mapCatalogToAccordion(items: CatalogItem[]): L1Item[] {
  return items.map((dept) => ({
    label: dept.name,
    route: `/marketplace?dept=${dept.slug}`,
    children: dept.categories.map((cat) => ({
      label: cat.name,
      route: `/marketplace?deptCat=${cat.slug}`,
      children: cat.productCategories.map((pc) => ({
        label: pc.name,
        route: `/marketplace?cat=${pc.slug}`,
      })),
    })),
  }));
}

// `enabled` should be false until the drawer has been opened at least once.
// This prevents firing a network request on app startup since the Drawer is
// always mounted in the layout tree even when hidden.
export function useDrawerMarketplace(enabled: boolean) {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data } = useQuery<{ getMarketplaceCatalog: CatalogItem[] }>(
    GET_MARKETPLACE_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  // Memoize the mapped result so the array reference is stable between renders.
  // mapCatalogToAccordion is only re-run when the raw API data actually changes.
  const items = useMemo<L1Item[]>(
    () =>
      data?.getMarketplaceCatalog
        ? mapCatalogToAccordion(data.getMarketplaceCatalog)
        : [],
    [data],
  );

  return { items };
}
