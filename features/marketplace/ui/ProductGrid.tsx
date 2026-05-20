"use client";

import { formatPrice, conditionLabel } from "@/data/products";
import type { Product } from "@/types/product";
import { Heart, ImageOff, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function ProductCard({ product, lang }: { product: Product; lang: string }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const CONDITION_COLORS: Record<string, string> = {
    NEW: "bg-primary-light-bg text-primary",
    LIKE_NEW: "bg-primary-light-bg text-primary",
    GOOD: "bg-amber-50 text-amber-700",
    FAIR: "bg-amber-50 text-amber-700",
    POOR: "bg-red-50 text-red-600",
  };

  return (
    <Link
      href={`/${lang}/product/${product.id}`}
      className="group relative bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="aspect-square bg-background-secondary flex items-center justify-center relative">
        <ImageOff size={36} className="text-foreground-muted" strokeWidth={1.5} />
        {/* Condition badge */}
        <span
          className={`absolute bottom-2 left-2 text-xs font-medium px-2 py-0.5 rounded-md ${CONDITION_COLORS[product.condition] ?? "bg-border text-foreground"}`}
        >
          {conditionLabel(product.condition)}
        </span>
        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            size={15}
            className={liked ? "fill-red-500 text-red-500" : "text-foreground-secondary"}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-foreground-tertiary uppercase tracking-wide truncate">
            {product.brand}
          </p>
        )}
        <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2 leading-snug">
          {product.name}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product && (
            <span className="flex items-center gap-0.5 text-xs text-foreground-secondary">
              <Star
                size={11}
                className="text-amber-400"
                fill="currentColor"
                strokeWidth={0}
              />
              {product.brand}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            added
              ? "bg-success/10 text-success"
              : "bg-primary-light-bg text-primary hover:bg-primary hover:text-white"
          }`}
        >
          <ShoppingCart size={13} strokeWidth={2} />
          {added ? "Added!" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}

export function ProductGrid({ products, lang }: { products: Product[]; lang: string }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-foreground-secondary">
        <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" strokeWidth={1.5} />
        <p className="font-semibold">No products found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} lang={lang} />
      ))}
    </div>
  );
}
