import type { StoreProduct } from "@/types/product";

/**
 * The card projection: only the fields the card cannot render without are
 * required, everything else on `StoreProduct` stays optional. A full
 * `StoreProduct` is still assignable, but lightweight projections (e.g.
 * federated search hits) can feed the card without fabricating a whole product.
 */
export type StoreProductCardProduct = Pick<StoreProduct, "id" | "name" | "price"> &
  Partial<Omit<StoreProduct, "id" | "name" | "price">>;
