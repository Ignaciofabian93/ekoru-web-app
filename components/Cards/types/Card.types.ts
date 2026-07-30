import type { BusinessType, ProductCondition } from "@/types/enums";
import type { EnvironmentalImpact } from "@/types/product";
import type { Seller } from "@/types/user";

export type Orientation = "horizontal" | "vertical";

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
}

export interface CardBackHeaderProps {
  /** Accessible name for the flip control. Pass a translated string. */
  flipLabel?: string;
  itemName: string;
}

export interface CardBackBodyProps {
  itemType: ItemType;
  impact?: EnvironmentalImpact | null;
}

export interface CardBackFooterProps {
  seller?: Seller | null;
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
  /** Accessible name for the flip control. Pass a translated string. */
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
  /** Drives the stock line: sold out at 0, low when `isLowStock`. */
  stock?: number;
  isLowStock?: boolean;
  /**
   * Current quantity. Pass with `onQuantityChange` to show the stepper; the
   * caller owns the value so it can be read when adding to the cart.
   */
  quantity?: number;
  onQuantityChange?: (next: number) => void;
  /** Upper bound of the stepper, normally the available stock. */
  maxQuantity?: number;
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
  /**
   * Gates the CTA independently of `state` — e.g. a store product in stock but
   * with the quantity stepper still at zero.
   */
  disabled?: boolean;
  loading?: boolean;
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
