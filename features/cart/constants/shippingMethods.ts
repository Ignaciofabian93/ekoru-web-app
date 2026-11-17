import { Home, Store, MapPin, Truck, type LucideIcon } from "lucide-react";
import { FEATURES, type FeatureKey } from "@/constants/features";
import type { ShippingMethod } from "@/types/checkout";

export type ShippingMethodMeta = {
  id: ShippingMethod;
  icon: LucideIcon;
  /** Whether selecting this method requires the buyer to fill in a delivery address. */
  requiresAddress: boolean;
  /** Whether the actual price is known up front (free / fixed) or has to be quoted. */
  isQuoted: boolean;
  /** Whether the method goes through the online-payment flow at all. */
  payable: boolean;
  /** Switchboard flag the method waits on; without one it is always offered. */
  feature?: FeatureKey;
};

/** Every method the backend knows, offered or not. */
export const SHIPPING_METHODS: ShippingMethodMeta[] = [
  {
    id: "DELIVERED_TO_HOME",
    icon: Home,
    requiresAddress: true,
    isQuoted: false,
    payable: true,
    feature: "homeDelivery",
  },
  {
    id: "IN_HOUSE_PICKUP",
    icon: Store,
    requiresAddress: false,
    isQuoted: false,
    payable: true,
  },
  {
    id: "IN_MID_POINT_PICKUP",
    icon: MapPin,
    requiresAddress: false,
    isQuoted: false,
    payable: false,
  },
  {
    id: "CARRIER",
    icon: Truck,
    requiresAddress: true,
    isQuoted: true,
    payable: true,
    feature: "courierShipping",
  },
];

/**
 * What checkout offers today: store pickup and a meeting point. Home delivery
 * and courier come back when their flags in `constants/features.ts` flip.
 */
export const AVAILABLE_SHIPPING_METHODS = SHIPPING_METHODS.filter(
  (m) => !m.feature || FEATURES[m.feature].available,
);

export const shippingMethodById = (id: ShippingMethod): ShippingMethodMeta =>
  SHIPPING_METHODS.find((m) => m.id === id) ?? SHIPPING_METHODS[0];
