import type { PageInfo } from "@/features/marketplace/types";
import type { StoreListProduct } from "@/features/stores/types";
import type { Product } from "@/types/product";

// A seller is either a marketplace account (PERSON, second-hand listings) or a
// business/store (STARTUP | COMPANY, retail/service inventory). Each surfaces a
// different catalog and a different set of profile features.
export type SellerKind = "marketplace" | "business";

// Seller storefront items are just the global Product (which already carries
// an optional `seller` relation), so no extension is needed.
export type SellerStorefrontProduct = Product;

export type SellerStorefrontPayload = {
  nodes: SellerStorefrontProduct[];
  pageInfo: PageInfo;
};

export type CategoryGroup = {
  id: string;
  name: string;
  href?: string;
  products: SellerStorefrontProduct[];
};

// The store catalog reuses the listing projection but also reads the product's
// sub-category so the storefront can group by it, mirroring the marketplace's
// category grouping.
export type SellerStoreProduct = StoreListProduct & {
  storeSubCategory?: {
    id: number | null;
    translation?: { name?: string | null; href?: string | null } | null;
  } | null;
};

export type StoreCategoryGroup = {
  id: string;
  name: string;
  href?: string;
  products: SellerStoreProduct[];
};
