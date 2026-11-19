import type { ProductCondition } from "@/types/enums";
import type { EnvironmentalImpact, StoreProductMaterialComposition } from "@/types/product";
import type { Seller } from "@/types/user";

export type MarketplaceCardProduct = {
  id: number;
  name: string;
  price: number;
  brand?: string | null;
  images?: string[] | null;
  condition?: ProductCondition | null;
  isExchangeable?: boolean | null;
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
  materials?: StoreProductMaterialComposition[] | null;
  seller?: Seller | null;
  sellerId?: string | null;
};

/** Services carry their provider's name, logo and location instead of a full `Seller`. */
export type ServiceCardService = {
  id: string | number;
  name: string;
  description?: string | null;
  image?: string | null;
  category?: string | null;
  price?: number | null;
  duration?: number | null;
  averageRating?: number | null;
  reviewsNumber?: number | null;
  isLiked?: boolean;
  providerName?: string | null;
  providerLogo?: string | null;
  providerLocation?: string | null;
};
