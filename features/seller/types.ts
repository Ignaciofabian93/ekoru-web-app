import type { PageInfo } from "@/features/marketplace/types";
import type { Product } from "@/types/product";

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
