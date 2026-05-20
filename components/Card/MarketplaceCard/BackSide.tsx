import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import type { Product } from "@/types/product";
import {
  ChevronRight,
  Droplets,
  Leaf,
  MapPin,
  Phone,
  RotateCcw,
  UserRound,
} from "lucide-react";

interface Props {
  product: Product;
  onFlip: () => void;
  onShowImpact: () => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
}

export default function CardBackSide({ product, onFlip, onShowImpact }: Props) {
  const { environmentalImpact, seller } = product;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: "hidden",
        border: `1px solid ${colors.borderStrong}`,
        boxShadow: shadows.sm,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        type="button"
        onClick={onFlip}
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
          zIndex: 10,
          border: "none",
          cursor: "pointer",
          boxShadow: shadows.sm,
        }}
      >
        <RotateCcw size={12} color={colors.onPrimary} strokeWidth={2.5} />
      </button>

      <div style={{ flex: 1, overflowY: "auto", padding: 12, paddingTop: 16 }}>
        {environmentalImpact && (
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              <Leaf size={12} color="#16a34a" strokeWidth={2} />
              <span
                style={{
                  fontSize: fontSize.xs,
                  fontFamily: fontFamily.sans,
                  fontWeight: 700,
                  color: colors.foreground,
                }}
              >
                Impacto Ambiental
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "row", gap: 8, marginBottom: 8 }}
            >
              <div
                style={{
                  flex: 1,
                  borderRadius: borderRadius.sm,
                  padding: 8,
                  backgroundColor: "#dcfce7",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 2,
                  }}
                >
                  <Leaf size={10} color="#16a34a" strokeWidth={2} />
                  <span
                    style={{
                      fontSize: fontSize.xs,
                      fontFamily: fontFamily.sans,
                      fontWeight: 400,
                      color: colors.foregroundSecondary,
                    }}
                  >
                    CO₂
                  </span>
                </div>
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  {formatNumber(environmentalImpact.totalCo2SavingsKG)} kg
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  borderRadius: borderRadius.sm,
                  padding: 8,
                  backgroundColor: "#dbeafe",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 2,
                  }}
                >
                  <Droplets size={10} color="#2563eb" strokeWidth={2} />
                  <span
                    style={{
                      fontSize: fontSize.xs,
                      fontFamily: fontFamily.sans,
                      fontWeight: 400,
                      color: colors.foregroundSecondary,
                    }}
                  >
                    Agua
                  </span>
                </div>
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 700,
                    color: "#2563eb",
                  }}
                >
                  {formatNumber(environmentalImpact.totalWaterSavingsLT)} L
                </span>
              </div>
            </div>

            {environmentalImpact.materialBreakdown.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 600,
                    color: colors.foregroundSecondary,
                  }}
                >
                  Materiales:
                </span>
                {environmentalImpact.materialBreakdown
                  .slice(0, 2)
                  .map((material, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: fontSize.xs,
                          fontFamily: fontFamily.sans,
                          fontWeight: 400,
                          color: colors.foregroundSecondary,
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {material.materialType}
                      </span>
                      <span
                        style={{
                          fontSize: fontSize.xs,
                          fontFamily: fontFamily.sans,
                          fontWeight: 600,
                          color: colors.foreground,
                          marginLeft: 4,
                        }}
                      >
                        {material.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={onShowImpact}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    marginTop: 8,
                    backgroundColor: `${colors.primary}1A`,
                    paddingBlock: 6,
                    paddingInline: 8,
                    borderRadius: borderRadius.sm,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: fontSize.xs,
                      fontFamily: fontFamily.sans,
                      fontWeight: 600,
                      color: colors.primary,
                    }}
                  >
                    Ver impacto completo
                  </span>
                  <ChevronRight size={12} color={colors.primary} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        )}

        {seller && (
          <div
            style={{
              borderTop: `1px solid ${colors.borderStrong}`,
              paddingTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: fontSize.xs,
                  fontFamily: fontFamily.sans,
                  fontWeight: 700,
                  color: colors.foreground,
                }}
              >
                Vendedor
              </span>
              <div
                style={{
                  backgroundColor: `${colors.primary}1A`,
                  paddingInline: 6,
                  paddingBlock: 2,
                  borderRadius: 4,
                }}
              >
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 600,
                    color: colors.primary,
                  }}
                >
                  {seller.sellerType}
                </span>
              </div>
            </div>
            {seller.profile && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <UserRound size={10} color={colors.foregroundSecondary} strokeWidth={2} />
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 400,
                    color: colors.foregroundSecondary,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {seller.email}
                </span>
              </div>
            )}
            {seller.phone && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Phone size={10} color={colors.foregroundSecondary} strokeWidth={2} />
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 400,
                    color: colors.foregroundSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {seller.phone}
                </span>
              </div>
            )}
            {seller.address && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <MapPin size={10} color={colors.foregroundSecondary} strokeWidth={2} />
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 400,
                    color: colors.foregroundSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {seller.address}
                  {seller.county ? `, ${seller.county.county}` : ""}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
