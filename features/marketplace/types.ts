import type { ProductCondition } from "@/types/enums";

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

export type MarketplaceProduct = {
  id: number;
  name: string;
  description: string;
  color?: string | null;
  brand: string;
  price: number;
  images: string[];
  badges: string[];
  interests: string[];
  condition: ProductCondition;
  conditionDescription?: string | null;
  isActive: boolean;
  isExchangeable: boolean;
  sellerId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  productCategory?: {
    id: string | number;
    translation?: { name: string; slug: string; href: string };
  } | null;
};

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

export const DEFAULT_PAGE_SIZE = 12;

export const PAGE_SIZE_OPTIONS = [12, 24, 48];

export const EMPTY_FILTERS: ProductFilters = {
  search: "",
  minPrice: "",
  maxPrice: "",
  condition: "",
  isExchangeable: false,
};
