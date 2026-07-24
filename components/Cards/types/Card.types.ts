import type { ProductCondition } from "@/types/enums";
import type { EnvironmentalImpact } from "@/types/product";
import type { Seller } from "@/types/user";

export type Orientation = "horizontal" | "vertical";
export type ItemType = "MARKETPLACE" | "STORE" | "SERVICE";

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
  isLikeEnabled?: boolean;
  isLiked?: boolean;
  /** Accessible name for the flip control. Pass a translated string. */
  flipLabel?: string;
  /** Accessible name for the favorite toggle. Pass a translated string. */
  likeLabel?: string;
}

export interface CardBodyProps {
  isProduct?: boolean;
  brand?: string;
  name: string;
  description?: string;
  price?: number;
  hasOffer?: boolean;
  offerPrice?: number;
  isExchangeable?: boolean;
  /** Free-text items the seller will consider swapping for (`product.interests`). */
  interests?: string[];
  /** Fired by the in-card exchange panel's CTA. Owns the propose-exchange logic. */
  onProposeExchange?: () => void;
}

export interface CardFooterProps {
  itemType: ItemType;
  url: string;
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
