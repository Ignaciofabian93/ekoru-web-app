import type { MarketplaceProduct, PageInfo } from "@/features/marketplace/types";
import type { Seller } from "@/types/user";

export type SellerStorefrontProduct = MarketplaceProduct & {
  seller?: Seller | null;
};

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
