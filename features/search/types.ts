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
  /** Counts per `SearchResultType`, which is what feeds the type tabs. */
  types?: SearchFacet[];
  tags?: SearchFacet[];
  /** Only the legacy PostgreSQL strategy fills this; Typesense leaves it out. */
  priceRanges?: SearchFacet[];
}

export interface SearchResponse {
  searchId?: number | null;
  query: string;
  processingTimeMs: number;
  /** Related terms the engine offers for the same query. */
  suggestions?: string[] | null;
  /** A spelling fix the engine is confident about ("did you mean …"). */
  correctedQuery?: string | null;
  items: SearchResultItem[];
  pageInfo: SearchPageInfo;
  facets?: SearchFacets | null;
}

/**
 * The catalogs a search can be narrowed to. `PRODUCTS` covers both marketplace
 * and store hits — the index has one `type` field per hit, but the API's filter
 * only splits goods from services, so the tabs stop where the backend does.
 */
export type SearchTypeFilter = "ALL" | "PRODUCTS" | "SERVICES";

/** The sort orders offered in the toolbar, a subset of the API's `SearchSortBy`. */
export type SearchSortBy = "RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "RATING";

/**
 * Everything the results body can narrow or reorder by. Every field maps
 * straight onto a `SearchInput` field, so filtering happens in the engine
 * rather than over the page of hits already on screen.
 */
export interface SearchFilters {
  type: SearchTypeFilter;
  sortBy: SearchSortBy;
  categories: string[];
  tags: string[];
  minPrice?: number;
  maxPrice?: number;
  /** On means "only items currently discounted". */
  hasOffer?: boolean;
}

export const SEARCH_PAGE_SIZE = 10;
