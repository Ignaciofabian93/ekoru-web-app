import { Home, Store, MapPin, Truck, type LucideIcon } from "lucide-react";
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
};

export const SHIPPING_METHODS: ShippingMethodMeta[] = [
  {
    id: "DELIVERED_TO_HOME",
    icon: Home,
    requiresAddress: true,
    isQuoted: false,
    payable: true,
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
  },
];

export const shippingMethodById = (id: ShippingMethod): ShippingMethodMeta =>
  SHIPPING_METHODS.find((m) => m.id === id) ?? SHIPPING_METHODS[0];
