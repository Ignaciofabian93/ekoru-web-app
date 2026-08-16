import { Droplets, Leaf, Trash2 } from "lucide-react";
import { Text } from "@/components/Primitives";
import {
  totalImpactClass,
  totalImpactIconSize,
  totalImpactIconStroke,
  totalImpactToneClass,
} from "@/design/total-impact";

export type TotalImpactType = "co2" | "water" | "waste";

export interface TotalImpactProps {
  type: TotalImpactType;
  totalValue: number;
  unit: string;
  label: string;
}

export function TotalImpact({ type, totalValue, unit, label }: TotalImpactProps) {
  const tone = totalImpactToneClass[type];

  return (
    <div className={totalImpactClass[type]}>
      {type === "co2" && (
        <Leaf
          size={totalImpactIconSize}
          className={tone}
          strokeWidth={totalImpactIconStroke}
        />
      )}
      {type === "water" && (
        <Droplets
          size={totalImpactIconSize}
          className={tone}
          strokeWidth={totalImpactIconStroke}
        />
      )}
      {type === "waste" && (
        <Trash2
          size={totalImpactIconSize}
          className={tone}
          strokeWidth={totalImpactIconStroke}
        />
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
