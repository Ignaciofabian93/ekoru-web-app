"use client";
import ServiceCard from "@/components/Card/ServiceCard/ServiceCard";
import type { ServiceCardData } from "@/components/Card/ServiceCard/types";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceNode } from "../types";

function toCardData(service: ServiceNode): ServiceCardData {
  return {
    id: service.id,
    name: service.name,
    description: service.description ?? undefined,
    image: service.images?.[0],
    providerName: service.seller?.profile?.businessName ?? undefined,
    providerLogo: service.seller?.profile?.logo ?? undefined,
    category: service.serviceCategory?.subCategory,
    priceFrom: service.basePrice ?? undefined,
    durationMinutes: service.duration ?? undefined,
    rating: service.averageRating ?? undefined,
    reviewsCount: service.reviewCount ?? undefined,
    isVerified: service.seller?.isVerified,
    isLiked: service.isLiked,
  };
}

interface Props {
  services: ServiceNode[];
}

export function ServiceList({ services }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const labels = {
    bookNow: t("card.bookNow"),
    verified: t("card.verified"),
    priceFromPrefix: t("card.priceFrom"),
    reviews: t("card.reviews"),
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={toCardData(service)} labels={labels} />
      ))}
    </div>
  );
}
