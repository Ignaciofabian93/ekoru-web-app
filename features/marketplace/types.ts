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

export type ProductSortField = "createdAt" | "price" | "viewCount" | "updatedAt";

export type SortDirection = "ASC" | "DESC";

// No `search`: product search is the navbar's job, so the marketplace bar
// only carries what the sort select and the filter modal own.
export type ProductFilters = {
  minPrice: string;
  maxPrice: string;
  condition: ProductCondition | "";
  isExchangeable: boolean;
};

export type ProductSortValue = "newest" | "oldest" | "priceAsc" | "priceDesc";

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export const EMPTY_FILTERS: ProductFilters = {
  minPrice: "",
  maxPrice: "",
  condition: "",
  isExchangeable: false,
};
