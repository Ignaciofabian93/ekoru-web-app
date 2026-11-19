"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { BackSideSkeleton } from "./CardSkeleton";
import CardWrapper from "./CardWrapper";
import { useProductCardId } from "./context/ProductCardContext";
import FrontSide from "./FrontSide";
import type { StoreProductCardProduct } from "./types";

const BackSide = dynamic(() => import("./BackSide"), { ssr: false, loading: BackSideSkeleton });

interface ProductCardProps {
  product: StoreProductCardProduct;
  lang: string;
  priority?: boolean;
  actions?: ReactNode;
}

export default function ProductCard({ product, lang, priority, actions }: ProductCardProps) {
  const cardId = useProductCardId();
  const {
    id,
    name,
    images,
    price,
    hasOffer,
    offerPrice,
    averageRating,
    reviewsNumber,
    isLowStock,
    isLiked,
    materials,
    seller,
  } = product;

  const stock = product.stock ?? 0;
  const isSoldOut = stock <= 0;
  const salePrice =
    hasOffer && typeof offerPrice === "number" && offerPrice < price ? offerPrice : undefined;

  return (
    <CardWrapper
      cardId={cardId}
      actions={actions}
      front={
        <FrontSide
          cardId={cardId}
          cardType="store"
          id={id}
          href={`/${lang}/store-product/${id}`}
          name={name}
          image={images?.[0]}
          price={price}
          offerPrice={salePrice}
          discount={
            salePrice !== undefined ? Math.round(((price - salePrice) / price) * 100) : undefined
          }
          rating={averageRating}
          reviews={reviewsNumber}
          location={seller?.county?.county}
          isLiked={isLiked}
          isSoldOut={isSoldOut}
          lowStock={isLowStock && !isSoldOut ? stock : undefined}
          priority={priority}
          isManaged={Boolean(actions)}
        />
      }
      back={
        <BackSide
          cardId={cardId}
          cardType="store"
          name={name}
          materials={materials}
          seller={seller}
        />
      }
    />
  );
}
