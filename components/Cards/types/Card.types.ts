import type { ProductCondition } from "@/types/enums";
import type {
  EnvironmentalImpact,
  StoreProductMaterialComposition,
} from "@/types/product";
import type { Seller } from "@/types/user";
import type { FavoriteSource } from "@/hooks/useToggleFavorite";

/**
 * Card projections: exactly the fields the cards read, nothing more.
 *
 * These are declared rather than derived (`Pick<Product, …>`) on purpose. Every
 * source feeds a slightly different shape — the federated search hits, the
 * seller storefront, the listings dashboard — and each nullable in its own
 * places. Deriving from the entity coupled the cards to fields they never
 * render, so unrelated schema drift broke callers. A full `Product` /
 * `StoreProduct` is still assignable; so is any lighter projection carrying
 * these fields.
 */
export type MarketplaceCardProduct = {
  id: number;
  name: string;
  price: number;
  brand?: string | null;
  images?: string[] | null;
  condition?: ProductCondition | null;
  isExchangeable?: boolean | null;
  /** Free-text items the seller will swap for. */
  interests?: string[] | null;
  isLiked?: boolean | null;
  environmentalImpact?: EnvironmentalImpact | null;
  seller?: Seller | null;
  sellerId?: string | null;
};

export type StoreProductCardProduct = {
  id: number;
  name: string;
  price: number;
  brand?: string | null;
  images?: string[] | null;
  hasOffer?: boolean | null;
  offerPrice?: number | null;
  averageRating?: number | null;
  reviewsNumber?: number | null;
  stock?: number | null;
  isLowStock?: boolean | null;
  isLiked?: boolean | null;
  /** What it is made of. Store products show this, never savings (D3). */
  materials?: StoreProductMaterialComposition[] | null;
  seller?: Seller | null;
  sellerId?: string | null;
};

/**
 * Services have no single canonical entity across the app — the catalog list,
 * the seller dashboard and search each return a different shape — so the card
 * takes its own flat projection and each caller adapts into it.
 */
export type ServiceCardService = {
  id: string | number;
  name: string;
  description?: string | null;
  /** Cover image path; resolved through `resolveImageUrl` by the card. */
  image?: string | null;
  /** Sub-category label, shown where a product card shows its brand. */
  category?: string | null;
  /** Starting price. Services are quoted "from", not at a fixed price. */
  price?: number | null;
  /** Minutes, as the services subgraph stores them; the card formats them. */
  duration?: number | null;
  averageRating?: number | null;
  reviewsNumber?: number | null;
  isLiked?: boolean;
  providerName?: string | null;
  providerLogo?: string | null;
  /** "County, Region" — shown on the back face beside the provider. */
  providerLocation?: string | null;
};

/**
 * What the card links to. The product types (`MARKETPLACE`, `STORE`, `SERVICE`)
 * lead to a listing; `BUSINESS` and `PROVIDER` lead to a seller's own page, so
 * their CTA reads "see the store/provider" rather than a buy action.
 */
export type ItemType = "MARKETPLACE" | "STORE" | "SERVICE" | "BUSINESS" | "PROVIDER";

/**
 * Brand tint for a business card's fallbacks — the cover gradient when the
 * business has no cover photo, and the logo tile when it has no logo. Stores
 * read lime, providers charcoal.
 */
export type BrandAccent = "primary" | "secondary" | "charcoal";

/**
 * A store or a service provider: cover, logo, name, blurb and location, with
 * how much it lists and a link to its page. Presentational — `StoresCard` and
 * `ServiceProviderCard` adapt a `Seller` into it.
 */
export interface BusinessCardProps {
  href: string;
  name?: string | null;
  description?: string | null;
  /** Raw image keys; the card resolves them through `resolveImageUrl`. */
  coverImage?: string | null;
  logo?: string | null;
  /**
   * Id of the business tag shown as a pill over the cover (`profile.tags[0]`).
   * The card resolves the label; an id it has no copy for shows nothing.
   */
  tagId?: string | null;
  location?: string | null;
  isVerified?: boolean;
  /**
   * What the footer counts. Omit `count` when the source doesn't carry one —
   * the footer then holds the link alone rather than claiming "0 products".
   */
  count?: number;
  countKind: "products" | "services";
  /** `BUSINESS` reads "explore the store", `PROVIDER` "see the provider". */
  itemType: Extract<ItemType, "BUSINESS" | "PROVIDER">;
  accent?: BrandAccent;
  /** Eager-loads the cover. Only for the first cards in view. */
  priority?: boolean;
}

/**
 * The product card shell: a square photo over its details, turning over to a
 * back face. Every product card has both faces — the flip control is always on
 * the photo.
 */
export interface CardProps {
  children: React.ReactNode;
  href: string;
  /** Accessible name for the card's navigation link (usually the item name). */
  ariaLabel?: string;
  /**
   * Owner controls (normally a `<ProductActionsMenu>`), rendered over the
   * photo's bottom-right corner, outside the turning faces, so an open dropdown
   * isn't clipped by the 3D transform.
   *
   * Passing this switches the card into **management mode**: the shopper
   * controls — favorite and the buy/book CTA — are hidden, because the viewer
   * owns the listing and manages it rather than buying it. The back face stays
   * available; its flip control takes the heart's place in the photo's corner.
   */
  actions?: React.ReactNode;
  /**
   * Management mode's primary action: replaces the buy/book CTA with an "Edit"
   * button. Also switches the card into management mode on its own, for a card
   * that needs the edit affordance without an overflow menu.
   */
  onEdit?: () => void;
}

export interface CardBackHeaderProps {
  /**
   * Titles the face. Flipped, the cover image is gone, so without this the back
   * never says which item the panel under it belongs to.
   */
  itemName: string;
  /**
   * Decides the eyebrow above the name: the products (`MARKETPLACE` / `STORE`)
   * head their face with the impact title, everything else shows the name
   * alone. Omit it to get just the name.
   */
  itemType?: ItemType;
}

export interface CardBackBodyProps {
  itemType: ItemType;
  /** Marketplace products — drives the savings panel. */
  impact?: EnvironmentalImpact | null;
  /** Store products — the material list they show instead of savings (D3). */
  materials?: StoreProductMaterialComposition[] | null;
  /**
   * Everything else — services show their blurb here instead. Falls back to
   * the dictionary's "no description yet" copy when empty.
   */
  description?: string | null;
}

export interface CardBackFooterProps {
  seller?: Seller | null;
  /**
   * Overrides for sources that carry a provider but not a full `Seller` — the
   * services list, for one, projects only a name and a logo. When set they win
   * over anything derived from `seller`.
   */
  name?: string;
  imageUrl?: string;
  /** Replaces the seller's region on the second line. */
  subtitle?: string;
}

export interface CardHeaderProps {
  coverImageString: string;
  imageAlt: string;
  priority?: boolean;
  condition?: ProductCondition;
  /** Shows the offer badge. Store products on promotion. */
  hasOffer?: boolean;
  /** When set, the offer badge reads "-N%" instead of the generic label. */
  discountPercent?: number;
  /** Dims the image and shows the sold-out badge. */
  isSoldOut?: boolean;
  isLiked?: boolean;
  /**
   * Id of the item the heart favorites, with the catalog it belongs to. Both
   * are required for the toggle to fire, so the button is hidden without them
   * rather than rendered as a control that does nothing.
   */
  itemId?: number;
  favoriteSource?: FavoriteSource;
  /**
   * Which back face the flip control leads to, so it gets the right accessible
   * name. Products reveal their impact panel; services reveal a description.
   * The card resolves the copy itself — callers pass the variant, not a
   * translated string.
   */
  flipTarget?: "impact" | "details";
}

/**
 * The product front face below the photo: price, name, where it is, and a row
 * of labels. Every label is derived from a semantic prop here — callers never
 * pass label text, so the copy stays in the card's dictionary.
 */
export interface CardBodyProps {
  name?: string;
  price?: number;
  /** With `offerPrice`, strikes `price` through and shows the offer instead. */
  hasOffer?: boolean;
  offerPrice?: number;
  /** Prefixes the price with "From" — services are quoted, not priced. */
  isPriceFrom?: boolean;
  /** Rendered with a pin under the name. Hidden when empty. */
  location?: string | null;
  /** 0–5, shown beside the price. Omit (or pass 0) to hide it. */
  averageRating?: number;
  reviewsNumber?: number;
  // Labels, in the order they render.
  /** "Accepts exchange" label — marketplace items open to a swap. */
  isExchangeable?: boolean;
  /** Drives the stock label: sold out at 0, low when `isLowStock`. */
  stock?: number;
  isLowStock?: boolean;
  /** Service duration in minutes, shown beside a clock as "45 min" or "4 h". */
  duration?: number;
  /** A neutral label for what kind of thing this is — a service's sub-category. */
  category?: string;
}

export interface CardFooterProps {
  itemType: ItemType;
  /**
   * An action button in place of the "view details" link — e.g. add to cart.
   * Without it the footer shows the link, which is the card's own `href`. The
   * card stays presentational: the caller owns the action, and decides whether
   * there is one at all (see `FEATURES.cardAddToCart`).
   */
  onAction?: () => void;
  /** Disables the action and relabels it "Out of stock". */
  isSoldOut?: boolean;
  /**
   * Units of this item the shopper already holds. Above zero — and paired with
   * `onQuantityChange` and `maxQuantity` — the action is replaced in place by a
   * quantity stepper, so the count is adjusted from the card itself. Back at
   * zero the action returns, which is how the last unit is removed.
   */
  quantity?: number;
  onQuantityChange?: (next: number) => void;
  /** Upper bound of the stepper, normally the available stock. */
  maxQuantity?: number;
}

export interface CardFlipButtonProps {
  /** Accessible name — the button is an icon alone. */
  label: string;
}
