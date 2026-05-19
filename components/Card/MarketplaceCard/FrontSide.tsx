"use client";

import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import type { Product } from "@/features/marketplace/types/Product";
import { conditionTranslate } from "@/utils/conditionTranslate";
import { formatPrice } from "@/utils/formatPrice";
import { getImageUrl } from "@/utils/getImageUrl";
import { ImageOff, RotateCcw, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface Props {
  product: Product;
  onFlip: () => void;
  onPress: () => void;
}

export default function CardFrontSide({ product, onFlip, onPress }: Props) {
  const [imageError, setImageError] = useState(false);
  const imageUri = getImageUrl(product.images?.[0]);

  return (
    <button
      type="button"
      onClick={onPress}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        border: `1px solid ${colors.borderStrong}`,
        boxShadow: shadows.sm,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
      }}
    >
      {/* Image */}
      <div style={{ aspectRatio: "4/3", backgroundColor: colors.backgroundTertiary, position: "relative", flexShrink: 0 }}>
        {imageUri && !imageError ? (
          <img
            src={imageUri}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageOff size={40} color={colors.foregroundTertiary} strokeWidth={1.5} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            backgroundColor: "rgba(255,255,255,0.9)",
            paddingInline: 8,
            paddingBlock: 4,
            borderRadius: 4,
          }}
        >
          <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 500, color: colors.foreground, textTransform: "capitalize" }}>
            {conditionTranslate(product.condition)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFlip(); }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: colors.primary,
            width: 28,
            height: 28,
            borderRadius: borderRadius.full,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: shadows.sm,
          }}
        >
          <RotateCcw size={12} color={colors.onPrimary} strokeWidth={2.5} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            {product.brand && (
              <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {product.brand}
              </span>
            )}
            {product.color && (
              <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary, marginLeft: 8 }}>
                {product.color}
              </span>
            )}
          </div>

          <p style={{ fontSize: fontSize.base, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.foreground, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </p>

          {product.description && (
            <p style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: fontSize.lg, fontFamily: fontFamily.sans, fontWeight: 700, color: colors.primary }}>
            {formatPrice(product.price)}
          </span>
          <div
            style={{
              backgroundColor: colors.primary,
              width: 32,
              height: 32,
              borderRadius: borderRadius.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={16} color={colors.onPrimary} strokeWidth={2} />
          </div>
        </div>
      </div>
    </button>
  );
}
