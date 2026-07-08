"use client";
import { useSellerType } from "@/store/useAuthStore";

import { BusinessPublishForm } from "./BusinessPublishForm";
import { PersonPublishForm } from "./PersonPublishForm";

/** Routes the seller to the right wizard: PERSON (and still-hydrating) sellers
 *  get the marketplace form, STARTUP / COMPANY sellers the business form. */
export function PublishForm() {
  const sellerType = useSellerType();
  const isBusiness = sellerType === "STARTUP" || sellerType === "COMPANY";

  return isBusiness ? <BusinessPublishForm /> : <PersonPublishForm />;
}
