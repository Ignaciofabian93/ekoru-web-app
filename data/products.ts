import type { Product } from "@/types/product";

export function conditionLabel(condition: Product["condition"]): string {
  const MAP: Record<NonNullable<Product["condition"]>, string> = {
    NEW: "Nuevo",
    LIKE_NEW: "Como nuevo",
    FAIR: "Regular",
    POOR: "Desgastado",
    OPEN_BOX: "",
    FOR_PARTS: "",
    REFURBISHED: "",
  };
  return MAP[condition] ?? condition;
}
