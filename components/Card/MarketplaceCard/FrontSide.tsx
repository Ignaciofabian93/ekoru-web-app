"use client";
import type { Product } from "@/types/product";
import { ImageOff, RotateCcw, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  product: Product;
  onFlip: () => void;
  onPress: () => void;
}

export default function CardFrontSide({ product, onFlip, onPress }: Props) {
  const [imageError, setImageError] = useState(false);
  const imageUri = "";

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border-strong bg-surface p-0 text-left shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-4/3 shrink-0 bg-background-tertiary">
        {imageUri && !imageError ? (
          <Image
            src={imageUri}
            alt={product.name}
            width={100}
            height={100}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff
              size={40}
              color="currentColor"
              strokeWidth={1.5}
              className="text-foreground-tertiary"
            />
          </div>
        )}

        <div className="absolute bottom-2 left-2 rounded-[4px] bg-white/90 px-2 py-1">
          <span className="font-sans text-xs font-medium capitalize text-foreground">
            {product.condition}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
          className="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm"
        >
          <RotateCcw size={12} color="currentColor" strokeWidth={2.5} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <div className="mb-1 flex flex-row items-center justify-between">
            {product.brand && (
              <span className="flex-1 truncate font-sans text-xs font-normal text-foreground-secondary">
                {product.brand}
              </span>
            )}
            {product.color && (
              <span className="ml-2 font-sans text-xs font-normal text-foreground-secondary">
                {product.color}
              </span>
            )}
          </div>

          <p className="m-0 mb-1 truncate font-sans text-base font-semibold text-foreground">
            {product.name}
          </p>

          {product.description && (
            <p className="m-0 mb-2 truncate font-sans text-sm font-normal text-foreground-secondary">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          <span className="font-sans text-lg font-bold text-primary">{product.price}</span>
          <div className="flex size-8 items-center justify-center rounded-sm bg-primary text-on-primary">
            <ShoppingCart size={16} color="currentColor" strokeWidth={2} />
          </div>
        </div>
      </div>
    </button>
  );
}
