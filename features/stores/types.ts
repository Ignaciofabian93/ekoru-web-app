import type { EnvironmentalImpact } from "@/types/product";
import type { Seller } from "@/types/user";

export type Language = "ES" | "EN" | "FR";

export type StoreCatalogSubItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

export type StoreCatalogCategory = {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: StoreCatalogSubItem[];
};

// Narrow projection of the global StoreProduct, holding only what the listing
// grid renders. The queries fetch the full detail fragment; we type just the
// fields we read so the card stays decoupled from the heavier payload.
export type StoreListProduct = {
  id: number;
  name: string;
  brand?: string | null;
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
  images?: string[];
  averageRating?: number;
  reviewsNumber?: number;
  // Returned by the detail fragment already; needed for stock-aware add-to-cart.
  stock?: number;
  sellerId?: string;
  isLiked?: boolean;
  // Fetched by the detail fragment; drives the seller's active/drafts split in
  // their own listings dashboard.
  isActive?: boolean;
  description?: string | null;
  // The listing queries fetch the detail fragment, which already includes the
  // environmental impact and seller — the card back side renders both.
  environmentalImpact?: EnvironmentalImpact | null;
  seller?: Seller | null;
};

export type PageInfo = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type StoreSortField = "createdAt" | "price";

// Matches the stores service's StoreProductSortInput: prisma field name plus
// lowercase order.
export type StoreSortInput = {
  field: StoreSortField;
  order: "asc" | "desc";
};

export type StoreSortValue = "newest" | "oldest" | "priceAsc" | "priceDesc";

/* ---- Consolidated category browsing (get*ProductsBySlug) ---- */

export type StoreSubCategoryDetail = {
  id: number;
  translation: { id: number; name: string; slug: string; href: string } | null;
};

export type StoreCategoryDetail = {
  id: number;
  translation: { id: number; name: string; slug: string; href: string } | null;
  storeSubCategory: StoreSubCategoryDetail[];
};

export type StoreFilters = {
  search: string;
  minPrice: string;
  maxPrice: string;
  onOfferOnly: boolean;
};

export const DEFAULT_PAGE_SIZE = 12;

export const PAGE_SIZE_OPTIONS = [12, 24, 48];

export const EMPTY_FILTERS: StoreFilters = {
  search: "",
  minPrice: "",
  maxPrice: "",
  onOfferOnly: false,
};
