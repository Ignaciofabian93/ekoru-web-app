import type {
  MarketplaceCardProduct,
  ServiceCardService,
  StoreProductCardProduct,
} from "@/components/Cards";
import type { Seller } from "@/types/user";

import type {
  ProductSearchResult,
  ServiceSearchResult,
  StoreProductSearchResult,
} from "./types";

/**
 * Search returns one flat projection for every catalog, so each domain card
 * needs its own adapter.
 *
 * Each hit pairs that projection with a federated reference to the entity it
 * came from (`product` / `storeProduct` / `service`), resolved by the owning
 * subgraph. The indexed fields win for anything the index carries — they're
 * what the result was ranked and filtered on — and the entity fills in
 * everything the index deliberately leaves out: exchangeability and condition
 * on marketplace products, stock and warranty on store products, environmental
 * impact and the seller profile on all three.
 *
 * The reference can still come back null if the owning subgraph is down, so
 * every entity read stays optional and the cards degrade to the flat projection
 * exactly as they did before.
 */

/** Business profiles carry a logo, person profiles a photo. */
function sellerDisplayImage(seller?: Seller | null): string | undefined {
  const profile = seller?.profile;
  if (!profile) return undefined;
  if ("logo" in profile) return profile.logo ?? undefined;
  if ("profileImage" in profile) return profile.profileImage ?? undefined;
  return undefined;
}

function sellerDisplayName(seller?: Seller | null): string | undefined {
  const profile = seller?.profile;
  if (!profile) return undefined;
  if ("businessName" in profile) return profile.businessName ?? undefined;
  if ("displayName" in profile) {
    return (
      profile.displayName ??
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ??
      undefined
    );
  }
  return undefined;
}

export function toMarketplaceCardProduct(
  item: ProductSearchResult,
): MarketplaceCardProduct {
  const entity = item.product;
  return {
    id: item.id,
    name: item.name,
    price: item.price ?? 0,
    sellerId: item.sellerId ?? "",
    images: item.images ?? [],
    brand: entity?.brand,
    condition: entity?.condition,
    isExchangeable: entity?.isExchangeable ?? false,
    interests: entity?.interests ?? null,
    isLiked: entity?.isLiked ?? false,
    environmentalImpact: entity?.environmentalImpact ?? null,
    seller: entity?.seller ?? null,
  };
}

export function toStoreProductCardProduct(
  item: StoreProductSearchResult,
): StoreProductCardProduct {
  const entity = item.storeProduct;
  return {
    id: item.id,
    name: item.name,
    price: item.price ?? 0,
    sellerId: item.sellerId ?? undefined,
    images: item.images ?? [],
    hasOffer: item.hasOffer,
    offerPrice: item.offerPrice ?? undefined,
    averageRating: item.rating ?? undefined,
    reviewsNumber: item.reviewCount ?? undefined,
    brand: entity?.brand,
    stock: entity?.stock,
    isLowStock: entity?.isLowStock,
    isLiked: entity?.isLiked ?? false,
    environmentalImpact: entity?.environmentalImpact,
    seller: entity?.seller ?? null,
  };
}

export function toServiceCardService(item: ServiceSearchResult): ServiceCardService {
  const entity = item.service;
  const seller = entity?.seller;
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? undefined,
    image: item.images?.[0],
    category: item.category ?? undefined,
    price: item.price ?? undefined,
    averageRating: item.rating ?? undefined,
    reviewsNumber: item.reviewCount ?? undefined,
    duration: entity?.duration ?? undefined,
    isLiked: entity?.isLiked ?? false,
    providerName: sellerDisplayName(seller),
    providerLogo: sellerDisplayImage(seller),
    providerLocation: seller?.county?.county ?? undefined,
  };
}
