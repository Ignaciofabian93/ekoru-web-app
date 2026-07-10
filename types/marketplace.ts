export type MarketplaceCatalog = {
  id: number;
  name: string;
  href: string;
  slug: string;
  categories: {
    id: number;
    name: string;
    href: string;
    slug: string;
    productCategories: {
      id: number;
      name: string;
      href: string;
      slug: string;
    }[];
  }[];
};
