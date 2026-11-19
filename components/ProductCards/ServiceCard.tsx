"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { BackSideSkeleton } from "./CardSkeleton";
import CardWrapper from "./CardWrapper";
import { useProductCardId } from "./context/ProductCardContext";
import FrontSide from "./FrontSide";
import type { ServiceCardService } from "./types";

const BackSide = dynamic(() => import("./BackSide"), { ssr: false, loading: BackSideSkeleton });

interface ServiceCardProps {
  service: ServiceCardService;
  lang: string;
  priority?: boolean;
  actions?: ReactNode;
}

export default function ServiceCard({ service, lang, priority, actions }: ServiceCardProps) {
  const cardId = useProductCardId();
  const {
    id,
    name,
    description,
    image,
    price,
    duration,
    category,
    averageRating,
    reviewsNumber,
    isLiked,
    providerName,
    providerLogo,
    providerLocation,
  } = service;

  return (
    <CardWrapper
      cardId={cardId}
      actions={actions}
      front={
        <FrontSide
          cardId={cardId}
          cardType="service"
          id={id}
          href={`/${lang}/service/${id}`}
          name={name}
          image={image}
          price={price}
          rating={averageRating}
          reviews={reviewsNumber}
          location={providerLocation}
          duration={duration}
          category={category}
          isLiked={isLiked}
          priority={priority}
          isManaged={Boolean(actions)}
        />
      }
      back={
        <BackSide
          cardId={cardId}
          cardType="service"
          name={name}
          description={description}
          sellerName={providerName}
          sellerImage={providerLogo}
          sellerLocation={providerLocation}
        />
      }
    />
  );
}
