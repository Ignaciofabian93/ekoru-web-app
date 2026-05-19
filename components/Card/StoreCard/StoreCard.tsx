"use client";

import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import type { Store } from "@/features/marketplace/types/Store";
import { sellerTypeTranslate } from "@/utils/sellerTypeTranslate";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";

interface Props {
  store: Store;
  onPress?: () => void;
}

function getInitials(store: Store): string {
  const words = store.storeName.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function StoreCard({ store, onPress }: Props) {
  const initials = getInitials(store);
  const county = store.seller.county?.county;
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onPress}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: 210,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        overflow: "hidden",
        border: `1px solid ${colors.borderStrong}`,
        boxShadow: shadows.sm,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
        opacity: pressed ? 0.92 : 1,
        transition: "opacity 0.1s ease",
      }}
    >
      {/* Gradient header band */}
      <div
        style={{
          height: 56,
          background: `linear-gradient(to right, ${colors.secondaryDark}, ${colors.secondary})`,
          flexShrink: 0,
        }}
      />

      {/* Floating initials avatar */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -28,
            left: 16,
            boxShadow: shadows.sm,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: borderRadius.xl,
              background: `linear-gradient(135deg, ${colors.secondaryDark}, ${colors.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${colors.surface}`,
            }}
          >
            <span style={{ fontSize: fontSize.lg, fontFamily: fontFamily.sans, fontWeight: 700, color: colors.onPrimary, letterSpacing: 0.5 }}>
              {initials}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ paddingTop: 34, paddingInline: 14, paddingBottom: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <span style={{ fontSize: fontSize.base, fontFamily: fontFamily.sans, fontWeight: 700, color: colors.foreground, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {store.storeName}
          </span>
          <div style={{ backgroundColor: colors.backgroundSecondary, paddingInline: 7, paddingBlock: 3, borderRadius: borderRadius.sm, border: `1px solid ${colors.borderLight}`, flexShrink: 0 }}>
            <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 500, color: colors.foregroundSecondary }}>
              {sellerTypeTranslate(store.seller.sellerType)}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Star size={13} color={colors.accent} fill={colors.accent} strokeWidth={0} />
          <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 700, color: colors.foreground }}>
            {store.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary }}>
            ({store.reviewCount})
          </span>
          <span style={{ fontSize: fontSize.xs, color: colors.foregroundTertiary, marginInline: 2 }}>·</span>
          <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary }}>
            {store.productCount} productos
          </span>
        </div>

        {county && (
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={12} color={colors.foregroundTertiary} strokeWidth={1.5} />
            <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {county}
            </span>
          </div>
        )}

        {store.tags.length > 0 && (
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 2 }}>
            {store.tags.map((tag) => (
              <div key={tag} style={{ backgroundColor: colors.backgroundSecondary, paddingInline: 8, paddingBlock: 3, borderRadius: borderRadius["2xl"], border: `1px solid ${colors.borderLight}` }}>
                <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 500, color: colors.foregroundSecondary }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
