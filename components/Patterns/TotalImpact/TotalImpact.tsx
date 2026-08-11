import { Text } from "@/components/Primitives";
import clsx from "clsx";
import { Leaf, Droplets, Trash2 } from "lucide-react";

export interface TotalImpactProps {
  type: "co2" | "water" | "waste";
  totalValue: number;
  unit: string;
  label: string;
}

export function TotalImpact({ type, totalValue, unit, label }: TotalImpactProps) {
  const textColorClass = clsx({
    "text-primary": type === "co2",
    "text-secondary-dark": type === "water",
    "text-gray-700": type === "waste",
  });

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-1.5 rounded-2xl p-4 shadow-sm shadow-slate-800/10",
        {
          "backdrop-blur-xl border border-primary/30 bg-linear-180 from-primary-light/5 to-primary-dark/5":
            type === "co2",
          "backdrop-blur-xl border border-secondary-dark/30 bg-linear-180 from-secondary-light/5 to-secondary-dark/5":
            type === "water",
          "": type === "waste",
        },
      )}
    >
      {type === "co2" && <Leaf size={22} className="text-primary" strokeWidth={1.6} />}
      {type === "water" && (
        <Droplets size={22} className="text-secondary-dark" strokeWidth={1.6} />
      )}
      {type === "waste" && (
        <Trash2 size={22} className="text-gray-700" strokeWidth={1.6} />
      )}
      <Text variant="span" size="2xl" weight="bold" className={textColorClass}>
        {totalValue.toFixed(1)} {unit}
      </Text>
      <Text variant="span" size="xs" className={textColorClass}>
        {label}
      </Text>
    </div>
  );
}
