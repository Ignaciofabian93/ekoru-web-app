export type MarketplaceCatalog = {
  id: number;
  name: string;
  slug: string;
  categories: {
    id: number;
    name: string;
    slug: string;
    productCategories: {
      id: number;
      name: string;
      slug: string;
    }[];
  }[];
};
