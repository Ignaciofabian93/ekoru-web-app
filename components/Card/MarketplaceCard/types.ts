// MarketplaceCard reuses the global Product/Seller types so the data flow
// stays aligned with what the GraphQL schema returns. Most fields are optional
// in the global types, so the card accesses them defensively.
import type { Product } from "@/types/product";
import type { Seller } from "@/types/user";

/**
 * The card projection: only the fields the card cannot render without are
 * required, everything else on `Product` stays optional. A full `Product` is
 * still assignable, but lightweight projections (e.g. federated search hits)
 * can feed the card without fabricating a whole product.
 */
export type MarketplaceCardProduct = Pick<
  Product,
  "id" | "name" | "price" | "sellerId"
> &
  Partial<Omit<Product, "id" | "name" | "price" | "sellerId">>;

export type MarketplaceCardSeller = Seller;
