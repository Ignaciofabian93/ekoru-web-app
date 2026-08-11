export type ImpactKind = "SALE" | "EXCHANGE";
export type ImpactRole = "BUYER" | "SELLER";

export interface ImpactCategoryBreakdown {
  productCategoryId?: number | null;
  /** Category name as it stood when the deal completed. */
  categoryName?: string | null;
  itemCount: number;
  co2SavingsKG: number;
  waterSavingsLT: number;
}

export interface ImpactHighlight {
  productId?: number | null;
  /** Product name as it stood when the deal completed. */
  productName?: string | null;
  kind: ImpactKind;
  role: ImpactRole;
  co2SavingsKG: number;
  waterSavingsLT: number;
  occurredAt: string;
}

export interface SellerImpactYear {
  year: number;
  totalCo2SavingsKG: number;
  totalWaterSavingsLT: number;
  totalItems: number;
  salesCount: number;
  exchangesCount: number;
  byCategory: ImpactCategoryBreakdown[];
  topItems: ImpactHighlight[];
  /** Admin-curated "equivalent to…" lines; may be empty. */
  co2Messages: string[];
  waterMessages: string[];
}
