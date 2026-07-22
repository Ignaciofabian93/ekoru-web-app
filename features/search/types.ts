import type { Product, StoreProduct } from "@/types/product";
import type { Service } from "@/types/services";

export type SearchResultType = "PRODUCT" | "STORE_PRODUCT" | "SERVICE";

/**
 * The slice of an owning entity a hit carries alongside the indexed fields.
 * The search index is a flat projection, so anything richer — exchangeability,
 * environmental impact, stock, the seller profile — is resolved through a
 * federated reference and projected by the fragments in
 * `graphql/search/fragments.ts`. Everything is optional because those fragments
 * select narrowly; widen the fragment first, then this type.
 */
type EntityRef<T extends { id: unknown }> = Pick<T, "id"> & Partial<T>;

/** Fields every hit shares, regardless of which catalog it came from. */
export interface SearchResultBase {
  id: number;
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

/** Marketplace (peer-to-peer) product hit. */
export interface ProductSearchResult extends SearchResultBase {
  type: "PRODUCT";
  /** Null only if the marketplace subgraph could not resolve the reference. */
  product?: EntityRef<Product> | null;
}

/** Store (business catalog) product hit. */
export interface StoreProductSearchResult extends SearchResultBase {
  type: "STORE_PRODUCT";
  /** Null only if the stores subgraph could not resolve the reference. */
  storeProduct?: EntityRef<StoreProduct> | null;
}

/** Service hit. */
export interface ServiceSearchResult extends SearchResultBase {
  type: "SERVICE";
  /** Null only if the services subgraph could not resolve the reference. */
  service?: EntityRef<Service> | null;
}

/**
 * A single catalog hit returned by the federated `search` query. Discriminated
 * on `type` so consumers can narrow to the variant a given card expects.
 */
export type SearchResultItem =
  | ProductSearchResult
  | StoreProductSearchResult
  | ServiceSearchResult;

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

export const SEARCH_PAGE_SIZE = 10;
