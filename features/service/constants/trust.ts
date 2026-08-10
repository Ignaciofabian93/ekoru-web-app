import { CalendarCheck, Star, Tag, type LucideIcon } from "lucide-react";

import type { ServiceKey } from "../i18n";

/**
 * The reassurance rows under the service actions. A service is not a checkout:
 * nothing is paid on Ekoru, nothing ships, and the price is a starting point —
 * so the copy points at scheduling, quoting and reputation instead of payment
 * and delivery. Keys are resolved by the screen that owns the dictionary.
 */
export const SERVICE_TRUST_ITEMS: {
  icon: LucideIcon;
  titleKey: ServiceKey;
  hintKey: ServiceKey;
}[] = [
  {
    icon: CalendarCheck,
    titleKey: "trust.scheduling",
    hintKey: "trust.schedulingHint",
  },
  { icon: Tag, titleKey: "trust.quote", hintKey: "trust.quoteHint" },
  { icon: Star, titleKey: "trust.reputation", hintKey: "trust.reputationHint" },
];
