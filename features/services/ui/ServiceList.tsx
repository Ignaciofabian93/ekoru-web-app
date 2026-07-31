"use client";
import { ServiceCard, type ServiceCardService } from "@/components/Cards";

import type { ServiceNode } from "../types";

function toCardService(service: ServiceNode): ServiceCardService {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    image: service.images?.[0],
    category: service.serviceCategory?.subCategory,
    price: service.basePrice,
    duration: service.duration,
    averageRating: service.averageRating,
    reviewsNumber: service.reviewCount,
    isLiked: service.isLiked,
    providerName: service.seller?.profile?.businessName,
    providerLogo: service.seller?.profile?.logo,
  };
}

interface Props {
  services: ServiceNode[];
  lang: string;
}

export function ServiceList({ services, lang }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {services.map((service, i) => (
        <ServiceCard
          key={service.id}
          service={toCardService(service)}
          lang={lang}
          priority={i < 4}
        />
      ))}
    </div>
  );
}
