import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { GET_COMMUNITY_CATALOG } from "@/graphql/community/queries";

type CommunitySubCategoryItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

type CommunityCatalogItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: CommunitySubCategoryItem[];
};

type L2Item = { label: string; route: string };
export type L1Item = { label: string; route: string; children?: L2Item[] };

// Maps the catalog response into the L1 > L2 accordion structure:
//   CommunityCatalogItem > CommunitySubCategoryItem
function mapCatalogToAccordion(items: CommunityCatalogItem[]): L1Item[] {
  return items.map((cat) => ({
    label: cat.name,
    route: `/community?cat=${cat.slug}`,
    children: cat.subCategoryItems.map((sub) => ({
      label: sub.name,
      route: `/community?sub=${sub.slug}`,
    })),
  }));
}

// `enabled` should be false until the drawer has been opened at least once.
export function useDrawerCommunity(enabled: boolean) {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data } = useQuery<{ getCommunityCatalog: CommunityCatalogItem[] }>(
    GET_COMMUNITY_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  const items = useMemo<L1Item[]>(
    () =>
      data?.getCommunityCatalog
        ? mapCatalogToAccordion(data.getCommunityCatalog)
        : [],
     
    [data?.getCommunityCatalog],
  );

  return { items };
}
