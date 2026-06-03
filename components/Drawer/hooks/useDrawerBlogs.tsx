import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { GET_BLOG_CATALOG } from "@/graphql/blog/queries";

type BlogCatalogItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

// Blog is flat (1 level) — no subcategories
export type L1Item = { label: string; route: string };

function mapCatalogToAccordion(items: BlogCatalogItem[]): L1Item[] {
  return items.map((topic) => ({
    label: topic.name,
    route: `/blog/${topic.slug}`,
  }));
}

// `enabled` should be false until the drawer has been opened at least once.
export function useDrawerBlogs(enabled: boolean) {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data } = useQuery<{ getBlogCatalog: BlogCatalogItem[] }>(
    GET_BLOG_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  const items = useMemo<L1Item[]>(
    () => (data?.getBlogCatalog ? mapCatalogToAccordion(data.getBlogCatalog) : []),
    [data],
  );

  return { items };
}
