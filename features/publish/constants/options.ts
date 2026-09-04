import type {
  DimensionUnit,
  ProductCondition,
  ServicePricing,
  WeightUnit,
} from "@/types/enums";
import { Store, Wrench, type LucideIcon } from "lucide-react";

import type { PublishKey } from "../i18n";

/** Where a listing is published. PERSON sellers always publish to MARKETPLACE;
 *  business sellers (STARTUP / COMPANY) choose between STORE and SERVICE. */
export type PublishTarget = "MARKETPLACE" | "STORE" | "SERVICE";

/** Product listings require between 1 and 3 photos. */
export const MIN_PRODUCT_IMAGES = 1;
export const MAX_PRODUCT_IMAGES = 3;

/** Minimum description length for product listings (marketplace & store). */
export const DESCRIPTION_MIN_LENGTH = 10;

/** Target options shown to business sellers on the first wizard step. */
export const BUSINESS_TARGETS: {
  value: Exclude<PublishTarget, "MARKETPLACE">;
  icon: LucideIcon;
  labelKey: PublishKey;
  descKey: PublishKey;
}[] = [
  {
    value: "STORE",
    icon: Store,
    labelKey: "targets.store",
    descKey: "targets.storeDesc",
  },
  {
    value: "SERVICE",
    icon: Wrench,
    labelKey: "targets.service",
    descKey: "targets.serviceDesc",
  },
];

/**
 * Second-hand product condition (marketplace listings), in the order the
 * seller reads them: best first. Labels are not carried here — they resolve
 * from the shared `cards` condition dictionary, so what a seller picks when
 * listing is worded exactly like the badge the buyer later sees.
 */
export const CONDITION_OPTIONS: readonly ProductCondition[] = [
  "NEW",
  "LIKE_NEW",
  "OPEN_BOX",
  "REFURBISHED",
  "GOOD",
  "FAIR",
  "POOR",
  "FOR_PARTS",
] as const;

/** Pricing model for service listings. */
export const SERVICE_PRICING_OPTIONS: { value: ServicePricing; labelKey: PublishKey }[] =
  [
    { value: "FIXED", labelKey: "servicePricingTypes.fixed" },
    { value: "QUOTATION", labelKey: "servicePricingTypes.quotation" },
    { value: "HOURLY", labelKey: "servicePricingTypes.hourly" },
    { value: "PACKAGE", labelKey: "servicePricingTypes.package" },
  ];

/** Weight units accepted by the stores subgraph (StoreProduct.weightUnit). */
export const WEIGHT_UNIT_OPTIONS: { value: WeightUnit; labelKey: PublishKey }[] = [
  { value: "KG", labelKey: "weightUnits.kg" },
  { value: "G", labelKey: "weightUnits.g" },
  { value: "LB", labelKey: "weightUnits.lb" },
  { value: "OZ", labelKey: "weightUnits.oz" },
];

/** Dimension units accepted by the stores subgraph (StoreProduct.dimensionUnit). */
export const DIMENSION_UNIT_OPTIONS: { value: DimensionUnit; labelKey: PublishKey }[] = [
  { value: "CM", labelKey: "dimensionUnits.cm" },
  { value: "M", labelKey: "dimensionUnits.m" },
  { value: "MM", labelKey: "dimensionUnits.mm" },
  { value: "INCH", labelKey: "dimensionUnits.inch" },
  { value: "FOOT", labelKey: "dimensionUnits.foot" },
];
