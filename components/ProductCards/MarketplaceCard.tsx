"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { BackSideSkeleton } from "./CardSkeleton";
import CardWrapper from "./CardWrapper";
import { useProductCardId } from "./context/ProductCardContext";
import FrontSide from "./FrontSide";
import type { MarketplaceCardProduct } from "./types";

const BackSide = dynamic(() => import("./BackSide"), { ssr: false, loading: BackSideSkeleton });

interface MarketplaceCardProps {
  product: MarketplaceCardProduct;
  lang: string;
  priority?: boolean;
  actions?: ReactNode;
}

export default function MarketplaceCard({
  product,
  lang,
  priority,
  actions,
}: MarketplaceCardProps) {
  const cardId = useProductCardId();
  const { id, name, images, price, condition, isExchangeable, isLiked, seller, environmentalImpact } =
    product;

  return (
    <CardWrapper
      cardId={cardId}
      actions={actions}
      front={
        <FrontSide
          cardId={cardId}
          cardType="marketplace"
          id={id}
          href={`/${lang}/product/${id}`}
          name={name}
          image={images?.[0]}
          price={price}
          condition={condition}
          isExchangeable={isExchangeable}
          isLiked={isLiked}
          location={seller?.county?.county}
          priority={priority}
          isManaged={Boolean(actions)}
        />
      }
      back={
        <BackSide
          cardId={cardId}
          cardType="marketplace"
          name={name}
          impact={environmentalImpact}
          seller={seller}
        />
      }
    />
  );
}
