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
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-strong bg-surface shadow-sm">
      <button
        type="button"
        onClick={onFlip}
        className="absolute top-2 right-2 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm"
      >
        <RotateCcw size={12} color="currentColor" strokeWidth={2.5} />
      </button>

      <div className="flex-1 overflow-y-auto p-3 pt-4">
        {environmentalImpact && (
          <div className="mb-3">
            <div className="mt-2 mb-2 flex flex-row items-center gap-1">
              <Leaf size={12} color="#16a34a" strokeWidth={2} />
              <span className="font-sans text-xs font-bold text-foreground">
                Impacto Ambiental
              </span>
            </div>

            <div className="mb-2 flex flex-row gap-2">
              <div className="flex-1 rounded-sm bg-[#dcfce7] p-2">
                <div className="mb-0.5 flex flex-row items-center gap-1">
                  <Leaf size={10} color="#16a34a" strokeWidth={2} />
                  <span className="font-sans text-xs font-normal text-foreground-secondary">
                    CO₂
                  </span>
                </div>
                <span className="font-sans text-xs font-bold text-[#16a34a]">
                  {formatNumber(environmentalImpact.totalCo2SavingsKG)} kg
                </span>
              </div>
              <div className="flex-1 rounded-sm bg-[#dbeafe] p-2">
                <div className="mb-0.5 flex flex-row items-center gap-1">
                  <Droplets size={10} color="#2563eb" strokeWidth={2} />
                  <span className="font-sans text-xs font-normal text-foreground-secondary">
                    Agua
                  </span>
                </div>
                <span className="font-sans text-xs font-bold text-[#2563eb]">
                  {formatNumber(environmentalImpact.totalWaterSavingsLT)} L
                </span>
              </div>
            </div>

            {environmentalImpact.materialBreakdown.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs font-semibold text-foreground-secondary">
                  Materiales:
                </span>
                {environmentalImpact.materialBreakdown.slice(0, 2).map((material, index) => (
                  <div key={index} className="flex flex-row items-center justify-between">
                    <span className="flex-1 truncate font-sans text-xs font-normal text-foreground-secondary">
                      {material.materialType}
                    </span>
                    <span className="ml-1 font-sans text-xs font-semibold text-foreground">
                      {material.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={onShowImpact}
                  className="mt-2 flex cursor-pointer flex-row items-center justify-center gap-1 rounded-sm bg-primary/10 px-2 py-1.5 text-primary"
                >
                  <span className="font-sans text-xs font-semibold">Ver impacto completo</span>
                  <ChevronRight size={12} color="currentColor" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        )}

        {seller && (
          <div className="flex flex-col gap-1.5 border-t border-border-strong pt-2">
            <div className="flex flex-row items-center gap-1.5">
              <span className="font-sans text-xs font-bold text-foreground">Vendedor</span>
              <div className="rounded-[4px] bg-primary/10 px-1.5 py-0.5">
                <span className="font-sans text-xs font-semibold text-primary">
                  {seller.sellerType}
                </span>
              </div>
            </div>
            {seller.profile && (
              <div className="flex flex-row items-center gap-1.5 text-foreground-secondary">
                <UserRound size={10} color="currentColor" strokeWidth={2} />
                <span className="flex-1 truncate font-sans text-xs font-normal text-foreground-secondary">
                  {seller.email}
                </span>
              </div>
            )}
            {seller.phone && (
              <div className="flex flex-row items-center gap-1.5 text-foreground-secondary">
                <Phone size={10} color="currentColor" strokeWidth={2} />
                <span className="truncate font-sans text-xs font-normal text-foreground-secondary">
                  {seller.phone}
                </span>
              </div>
            )}
            {seller.address && (
              <div className="flex flex-row items-center gap-1.5 text-foreground-secondary">
                <MapPin size={10} color="currentColor" strokeWidth={2} />
                <span className="truncate font-sans text-xs font-normal text-foreground-secondary">
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
