import type { ProductCondition, ServicePricing } from "@/types/enums";
import { Store, Wrench, type LucideIcon } from "lucide-react";

import type { PublishKey } from "../i18n";

/** Where a listing is published. PERSON sellers always publish to MARKETPLACE;
 *  business sellers (STARTUP / COMPANY) choose between STORE and SERVICE. */
export type PublishTarget = "MARKETPLACE" | "STORE" | "SERVICE";

/** Product listings require between 1 and 3 photos. */
export const MIN_PRODUCT_IMAGES = 1;
export const MAX_PRODUCT_IMAGES = 3;

/** Target options shown to business sellers on the first wizard step. */
export const BUSINESS_TARGETS: {
  value: Exclude<PublishTarget, "MARKETPLACE">;
  icon: LucideIcon;
  labelKey: PublishKey;
  descKey: PublishKey;
}[] = [
  { value: "STORE", icon: Store, labelKey: "targets.store", descKey: "targets.storeDesc" },
  {
    value: "SERVICE",
    icon: Wrench,
    labelKey: "targets.service",
    descKey: "targets.serviceDesc",
  },
];

/** Second-hand product condition (marketplace listings). */
export const CONDITION_OPTIONS: { value: ProductCondition; labelKey: PublishKey }[] = [
  { value: "NEW", labelKey: "conditions.new" },
  { value: "OPEN_BOX", labelKey: "conditions.open_box" },
  { value: "LIKE_NEW", labelKey: "conditions.like_new" },
  { value: "FAIR", labelKey: "conditions.fair" },
  { value: "POOR", labelKey: "conditions.poor" },
  { value: "FOR_PARTS", labelKey: "conditions.for_parts" },
  { value: "REFURBISHED", labelKey: "conditions.refurbished" },
];

/** Pricing model for service listings. */
export const SERVICE_PRICING_OPTIONS: { value: ServicePricing; labelKey: PublishKey }[] = [
  { value: "FIXED", labelKey: "servicePricingTypes.fixed" },
  { value: "QUOTATION", labelKey: "servicePricingTypes.quotation" },
  { value: "HOURLY", labelKey: "servicePricingTypes.hourly" },
  { value: "PACKAGE", labelKey: "servicePricingTypes.package" },
];
