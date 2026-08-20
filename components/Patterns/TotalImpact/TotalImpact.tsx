import { Droplets, Leaf, Trash2 } from "lucide-react";
import { Text } from "@/components/Primitives";
import {
  impactIconSize,
  impactIconStroke,
  impactToneClass,
  totalImpactClass,
} from "@/design/total-impact";

export type TotalImpactType = "co2" | "water" | "waste";

export interface TotalImpactProps {
  type: TotalImpactType;
  totalValue: number;
  unit: string;
  label: string;
}

export function TotalImpact({ type, totalValue, unit, label }: TotalImpactProps) {
  const tone = impactToneClass[type];
  const size = impactIconSize.lg;

  return (
    <div className={totalImpactClass[type]}>
      {type === "co2" && (
        <Leaf size={size} className={tone} strokeWidth={impactIconStroke} />
      )}
      {type === "water" && (
        <Droplets size={size} className={tone} strokeWidth={impactIconStroke} />
      )}
      {type === "waste" && (
        <Trash2 size={size} className={tone} strokeWidth={impactIconStroke} />
      )}
      <Text variant="span" size="2xl" weight="bold" className={tone}>
        {totalValue.toFixed(1)} {unit}
      </Text>
      <Text variant="span" size="xs" className={tone}>
        {label}
      </Text>
    </div>
  );
}
