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

export type SortDirection = "ASC" | "DESC";

export type StoreSortValue = "newest" | "oldest" | "priceAsc" | "priceDesc";

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
