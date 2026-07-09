"use client";

import { conditionLabel } from "@/data/products";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import type { Product } from "@/types/product";
import { formatMaterialAmount, materialLabel } from "@/utils/impact";
import {
  Droplets,
  ImageOff,
  Leaf,
  MapPin,
  Phone,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CONDITION_COLORS: Record<string, string> = {
  NEW: "bg-primary-light-bg text-primary",
  LIKE_NEW: "bg-primary-light-bg text-primary",
  GOOD: "bg-amber-50 text-amber-700",
  FAIR: "bg-amber-50 text-amber-700",
  POOR: "bg-red-50 text-red-600",
};

const SELLER_TYPE_LABELS: Record<string, string> = {
  PERSON: "Person",
  STARTUP: "Startup",
  COMPANY: "Company",
};

export function ProductDetail({ product, lang }: { product: Product; lang: string }) {
  const formatPrice = useFormatPrice();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex-1 bg-background">
      {/* Image */}
      <div className="w-full aspect-4/3 md:aspect-16/7 bg-background-secondary flex items-center justify-center relative max-h-96">
        <ImageOff size={56} className="text-foreground-muted" strokeWidth={1.5} />
        <span
          className={`absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-md ${CONDITION_COLORS[product.condition] ?? "bg-border text-foreground"}`}
        >
          {conditionLabel(product.condition)}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {product.brand && (
              <p className="text-sm text-foreground-secondary mb-1">{product.brand}</p>
            )}
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>
          </div>
          <span className="text-2xl font-bold text-primary shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-foreground-secondary leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Details */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Details</h2>
          <div className="flex flex-col divide-y divide-border-light">
            {product.color && (
              <div className="flex justify-between py-2.5">
                <span className="text-sm text-foreground-secondary">Color</span>
                <span className="text-sm font-medium text-foreground">
                  {product.color}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2.5">
              <span className="text-sm text-foreground-secondary">Condition</span>
              <span className="text-sm font-medium text-foreground">
                {conditionLabel(product.condition)}
              </span>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        {product.environmentalImpact && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">
              Environmental Impact
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-background-secondary border border-border-light rounded-xl p-4 flex flex-col items-center gap-1.5">
                <Leaf size={20} className="text-primary" strokeWidth={1.5} />
                <span className="text-lg font-bold text-foreground">
                  {product.environmentalImpact.totalCo2SavingsKG} kg
                </span>
                <span className="text-xs text-foreground-secondary text-center">
                  CO₂ saved
                </span>
              </div>
              <div className="bg-background-secondary border border-border-light rounded-xl p-4 flex flex-col items-center gap-1.5">
                <Droplets size={20} className="text-secondary" strokeWidth={1.5} />
                <span className="text-lg font-bold text-foreground">
                  {product.environmentalImpact.totalWaterSavingsLT} L
                </span>
                <span className="text-xs text-foreground-secondary text-center">
                  Water saved
                </span>
              </div>
            </div>
            {product.environmentalImpact.materialBreakdown.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground-secondary mb-2">
                  Materials
                </p>
                <div className="flex flex-col divide-y divide-border-light">
                  {product.environmentalImpact.materialBreakdown.map((m) => (
                    <div key={m.materialType} className="flex justify-between py-2">
                      <span className="text-sm text-foreground">{materialLabel(m)}</span>
                      <span className="text-sm font-medium text-foreground-secondary">
                        {formatMaterialAmount(m)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seller */}
        {product.seller && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">Seller</h2>
            <div className="bg-background-secondary border border-border-light rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <User size={16} className="text-foreground-secondary" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-foreground flex-1">
                  {product.seller.address}
                </span>
                <span className="text-xs font-medium bg-primary-dark text-white px-2 py-0.5 rounded">
                  {SELLER_TYPE_LABELS[product.seller.sellerType] ??
                    product.seller.sellerType}
                </span>
              </div>
              {product.seller.county && (
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <MapPin size={16} strokeWidth={1.5} />
                  <span className="text-sm">
                    {product.seller.address}
                    {product.seller.address ? ` · ${product.seller.address}` : ""}
                  </span>
                </div>
              )}
              {product.seller.phone && (
                <div className="flex items-center gap-2 text-foreground-secondary">
                  <Phone size={16} strokeWidth={1.5} />
                  <span className="text-sm">{product.seller.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer CTA */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-3 flex gap-3">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-colors ${
            added ? "bg-success text-white" : "bg-primary text-white hover:opacity-90"
          }`}
        >
          <ShoppingCart size={20} strokeWidth={2} />
          {added ? "Added to cart!" : "Add to cart"}
        </button>
        <Link
          href={`/${lang}/cart`}
          className="w-14 flex items-center justify-center border-2 border-primary rounded-xl text-primary hover:bg-primary-light-bg transition-colors"
        >
          <ShoppingCart size={20} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
