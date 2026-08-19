import type { BusinessType, ProductCondition } from "@/types/enums";
import type { EnvironmentalImpact } from "@/types/product";
import type { Seller } from "@/types/user";
import type { FavoriteSource } from "@/hooks/useToggleFavorite";

export type Orientation = "horizontal" | "vertical";

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
  environmentalImpact?: EnvironmentalImpact | null;
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
  /** Free-text as returned by the backend, e.g. "45 min" — rendered verbatim. */
  duration?: string | null;
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

/** Brand tint for the seller-card panel — stores read teal, providers amber. */
export type BrandAccent = "primary" | "secondary" | "amber";

export interface CardProps {
  children: React.ReactNode;
  orientation?: Orientation;
  hasBackSide?: boolean;
  href: string;
  /** Accessible name for the card's navigation link (usually the item name). */
  ariaLabel?: string;
  /**
   * Owner controls (normally a `<ProductActionsMenu>`), rendered top-right over
   * the front face so an open dropdown isn't clipped by the 3D transform.
   *
   * Passing this switches the card into **management mode**: the shopper
   * controls — favorite and the buy/book CTA — are hidden, because the viewer
   * owns the listing and manages it rather than buying it. The back face stays
   * available; its flip control moves to the bottom-right corner.
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
  /** Accessible name for the flip control. Pass a translated string. */
  flipLabel?: string;
  itemName: string;
}

export interface CardBackBodyProps {
  itemType: ItemType;
  /** Products (`MARKETPLACE` / `STORE`) — drives the impact panel. */
  impact?: EnvironmentalImpact | null;
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
  isExchangeable?: boolean;
  /** Shows the offer badge. Store products on promotion. */
  hasOffer?: boolean;
  /** When set, the offer badge reads "-N%" instead of the generic label. */
  discountPercent?: number;
  /** Dims the image and shows the sold-out badge. */
  isSoldOut?: boolean;
  isLikeEnabled?: boolean;
  isLiked?: boolean;
  /**
   * Id of the item the heart favorites, with the catalog it belongs to. Both
   * are required for the toggle to fire, so the button is hidden without them
   * rather than rendered as a control that does nothing.
   */
  itemId?: number;
  favoriteSource?: FavoriteSource;
  /**
   * Which back face the flip leads to, so the control gets the right
   * accessible name. Products reveal their impact panel; services reveal a
   * description. The card resolves the copy itself — callers pass the variant,
   * not a translated string.
   */
  flipTarget?: "impact" | "details";
  /** Escape hatch: overrides the name `flipTarget` would resolve to. */
  flipLabel?: string;
  /** Accessible name for the favorite toggle. Pass a translated string. */
  likeLabel?: string;
  /**
   * `false` switches the header from a product photo to the seller brand panel:
   * a tinted backdrop with the logo on a light tile.
   */
  isProduct?: boolean;
  /** Brand panel only — shows the verified pill. */
  isVerified?: boolean;
  /** Brand panel only — fallback shown when the seller has no logo. */
  initials?: string;
  /** Brand panel only. Defaults to `secondary`. */
  accent?: BrandAccent;
}

export interface CardBodyProps {
  isProduct?: boolean;
  brand?: string;
  name?: string;
  description?: string;
  price?: number;
  /** With `offerPrice`, strikes `price` through and shows the offer instead. */
  hasOffer?: boolean;
  offerPrice?: number;
  isExchangeable?: boolean;
  /** Free-text items the seller will consider swapping for (`product.interests`). */
  interests?: string[];
  exchangeRedirectUrl?: string;
  /** 0–5. Omit (or pass 0) to hide the rating row entirely. */
  averageRating?: number;
  reviewsNumber?: number;
  /**
   * Service duration, rendered verbatim beside a clock. Free text from the
   * backend ("45 min", "2 h"), so the card formats nothing.
   */
  duration?: string;
  /** Prefixes the price with "From" — services are quoted, not priced. */
  isPriceFrom?: boolean;
  /** Drives the stock line: sold out at 0, low when `isLowStock`. */
  stock?: number;
  isLowStock?: boolean;
  // Business
  businessName?: string;
  businessType?: BusinessType;
  /** "County, Region" — rendered with a pin beside the business name. */
  location?: string | null;
}

/**
 * `added` flashes the post-add confirmation; `unavailable` disables the CTA.
 * The card resolves the copy for each, so callers never pass translated text.
 */
export type CardFooterState = "default" | "added" | "unavailable";

export interface CardFooterProps {
  itemType: ItemType;
  url: string;
  /**
   * Replaces the default "navigate to `url`" behavior — e.g. add to cart. The
   * card stays presentational: the caller owns the action.
   */
  onAction?: () => void;
  state?: CardFooterState;
  /** Gates the CTA independently of `state` — e.g. an unresolved seller. */
  disabled?: boolean;
  loading?: boolean;
  /**
   * Units of this item the shopper already holds. Above zero — and paired with
   * `onQuantityChange` and `maxQuantity` — the CTA is replaced in place by a
   * quantity stepper, so the count is adjusted from the card itself. Back at
   * zero the CTA returns, which is how the last unit is removed.
   */
  quantity?: number;
  onQuantityChange?: (next: number) => void;
  /** Upper bound of the stepper, normally the available stock. */
  maxQuantity?: number;
}

export interface CardFrontSideProps {
  children: React.ReactNode;
}

export interface CardBackSideProps {
  children: React.ReactNode;
}

export interface CardFlipButtonProps {
  label?: string;
  className?: string;
}
