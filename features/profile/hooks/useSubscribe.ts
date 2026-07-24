"use client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

import {
  BUSINESS_MEMBERSHIPS,
  PERSON_MEMBERSHIPS,
} from "@/graphql/subscription/queries";
import { CREATE_MEMBERSHIP_PAYMENT } from "@/graphql/subscription/mutations";
import { submitWebpayForm } from "@/lib/webpay";
import { useSellerType } from "@/store/useAuthStore";
import type { CreatePaymentResponse } from "@/types/checkout";

type MembershipRow = { id: string; membershipType: string };

/**
 * Wires the subscription plan cards to the platform-payment rail. Given a plan
 * key (the card's membershipType), it resolves the real DB membership id and
 * starts a Webpay payment to EKORU, then hands off exactly like cart checkout.
 * The buyer returns to /cart/confirmation and the membership activates on the
 * completed payment.
 */
export function useSubscribe() {
  const sellerType = useSellerType();
  const isBusiness = sellerType !== null && sellerType !== "PERSON";
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const { data: personData } = useQuery<{ personMemberships: MembershipRow[] }>(
    PERSON_MEMBERSHIPS,
    { skip: isBusiness },
  );
  const { data: businessData } = useQuery<{
    businessMemberships: MembershipRow[];
  }>(BUSINESS_MEMBERSHIPS, { skip: !isBusiness });

  const memberships = isBusiness
    ? businessData?.businessMemberships
    : personData?.personMemberships;

  const [createMembershipPayment] = useMutation<
    { createMembershipPayment: CreatePaymentResponse },
    { membershipId: number; returnUrl: string }
  >(CREATE_MEMBERSHIP_PAYMENT);

  /** Start the payment for the plan whose membershipType === `planKey`. */
  const subscribe = async (planKey: string): Promise<void> => {
    const membership = memberships?.find((m) => m.membershipType === planKey);
    if (!membership) return;

    setPendingKey(planKey);
    try {
      const origin =
        typeof window === "undefined" ? "" : window.location.origin;
      const returnUrl = `${origin}/api/checkout/return/webpay`;

      const res = await createMembershipPayment({
        variables: { membershipId: Number(membership.id), returnUrl },
      });
      const redirect = res.data?.createMembershipPayment.redirect;
      if (!redirect) throw new Error("createMembershipPayment returned no redirect");

      if (redirect.kind === "WEBPAY_FORM") {
        submitWebpayForm(redirect.url, redirect.token);
      } else {
        window.location.assign(redirect.url);
      }
    } catch {
      setPendingKey(null);
    }
  };

  return {
    subscribe,
    pendingKey,
    /** A plan key is subscribable only if we resolved a matching membership id. */
    isSubscribable: (planKey: string) =>
      Boolean(memberships?.some((m) => m.membershipType === planKey)),
  };
}
