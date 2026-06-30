export type SearchResultType = "PRODUCT" | "STORE_PRODUCT" | "SERVICE";

/** A single catalog hit returned by the federated `search` query. */
export interface SearchResultItem {
  id: number;
  type: SearchResultType;
  name: string;
  description?: string | null;
  price?: number | null;
  offerPrice?: number | null;
  hasOffer: boolean;
  images?: string[] | null;
  category?: string | null;
  subcategory?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  sellerId?: string | null;
  tags?: string[] | null;
  highlightedName?: string | null;
}

export interface SearchPageInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchFacet {
  name: string;
  count: number;
}

export interface SearchFacets {
  categories?: SearchFacet[];
  types?: SearchFacet[];
  tags?: SearchFacet[];
}

export interface SearchResponse {
  searchId?: number | null;
  query: string;
  processingTimeMs: number;
  items: SearchResultItem[];
  pageInfo: SearchPageInfo;
  facets?: SearchFacets | null;
}

export const SEARCH_PAGE_SIZE = 24;
