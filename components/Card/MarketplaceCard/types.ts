// MarketplaceCard reuses the global Product/Seller types so the data flow
// stays aligned with what the GraphQL schema returns. Most fields are optional
// in the global types, so the card accesses them defensively.
import type { Product } from "@/types/product";
import type { Seller } from "@/types/user";

export type MarketplaceCardProduct = Product;
export type MarketplaceCardSeller = Seller;
