export type StoreCatalog = {
  id: number;
  name: string;
  slug: string;
  subCategoryItems: {
    id: number;
    name: string;
    slug: string;
  };
};
