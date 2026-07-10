export type StoreCatalog = {
  id: number;
  name: string;
  href: string;
  slug: string;
  subCategoryItems: {
    id: number;
    name: string;
    href: string;
    slug: string;
  };
};
