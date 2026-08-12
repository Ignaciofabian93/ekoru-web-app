import type { ServiceCardService } from "@/components/Cards";
import { getBusinessProfile } from "@/utils/sellerInformation";

import type { ServiceDetail } from "./types";

/**
 * `ServiceDetail` (what the services subgraph returns) → what `ServiceCard`
 * renders. Shared by every surface that lists a provider's services — the
 * detail page's "other services" strip and the seller profile — so a card looks
 * the same wherever it appears.
 */
export function toServiceCardService(service: ServiceDetail): ServiceCardService {
  // Services are published by businesses, but `Seller.profile` is a union —
  // narrow it before reading the business-only name and logo.
  const profile = service.seller ? getBusinessProfile(service.seller) : null;

  return {
    id: service.id,
    name: service.name,
    description: service.description,
    // `displayImage` already falls back to the provider's logo server-side.
    image: service.displayImage ?? service.images?.[0],
    category:
      service.serviceCategory?.translation?.subCategory ??
      service.serviceCategory?.subCategory,
    price: service.basePrice,
    duration: service.duration,
    averageRating: service.averageRating,
    reviewsNumber: service.reviewCount,
    isLiked: service.isLiked ?? undefined,
    providerName: profile?.businessName,
    providerLogo: profile?.logo,
  };
}
