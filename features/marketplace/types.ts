import type { ProductCondition } from "@/types/enums";
import type { Product } from "@/types/product";

export type Language = "ES" | "EN" | "FR";

export type CatalogProductCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

export type CatalogDepartmentCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
  productCategories: CatalogProductCategory[];
};

export type CatalogDepartment = {
  id: number;
  name: string;
  slug: string;
  href: string;
  categories: CatalogDepartmentCategory[];
};

// MarketplaceProduct is just the global Product. Keeping the alias makes it
// easy to swap in a narrower projection later if the marketplace ever needs
// one, without churning every import site.
export type MarketplaceProduct = Product;

export type PageInfo = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ProductSortField =
  | "createdAt"
  | "price"
  | "viewCount"
  | "updatedAt";

export type SortDirection = "ASC" | "DESC";

export type ProductFilters = {
  search: string;
  minPrice: string;
  maxPrice: string;
  condition: ProductCondition | "";
  isExchangeable: boolean;
};

export type ProductSortValue =
  | "newest"
  | "oldest"
  | "priceAsc"
  | "priceDesc"
  | "popular";

export const DEFAULT_PAGE_SIZE = 5;

export const PAGE_SIZE_OPTIONS = [5, 12, 24, 48];

export const EMPTY_FILTERS: ProductFilters = {
  search: "",
  minPrice: "",
  maxPrice: "",
  condition: "",
  isExchangeable: false,
};
