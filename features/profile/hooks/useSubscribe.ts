"use client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";

import {
  BUSINESS_MEMBERSHIPS,
  MY_SUBSCRIPTION,
  PERSON_MEMBERSHIPS,
} from "@/graphql/subscription/queries";
import { CREATE_MEMBERSHIP_PAYMENT } from "@/graphql/subscription/mutations";
import {
  DEFAULT_PAYMENT_PROVIDER,
  paymentReturnUrl,
} from "@/features/cart/constants/paymentProviders";
import { useToast } from "@/hooks/useToast";
import { submitWebpayForm } from "@/lib/webpay";
import { useSeller, useSellerType } from "@/store/useAuthStore";
import type { CreatePaymentResponse } from "@/types/checkout";

type MembershipRow = {
  id: string;
  membershipType: string;
  durationMonths: number;
  pricing?: { price: number; currency: string } | null;
};

/**
 * One term on sale for a plan: the panel creates a membership row per plan and
 * term length (Startup 1 month, Startup 12 months…), each with its own price
 * for the seller's country (USR-16).
 */
export type PlanTerm = {
  membershipId: string;
  months: number;
  price: number;
  currency: string;
};

export type MySubscription = {
  id: number;
  membershipId: string;
  plan: string;
  isBusiness: boolean;
  startDate: string;
  /** The end of everything paid for this plan, prepaid extensions included. */
  endDate: string | null;
  isActive: boolean;
  autoRenew: boolean;
};

/**
 * Wires the subscription plan cards to the platform-payment rail. Given the
 * term the buyer picked, it starts a payment to EKORU (Mercado Pago), then
 * hands off exactly like cart checkout.
 * The buyer returns to /cart/confirmation and the membership activates on the
 * completed payment. Whether the term extends, upgrades or starts fresh is
 * decided by the users subgraph, which also refuses a lower plan while one
 * runs.
 */
export function useSubscribe() {
  const toast = useToast();
  const sellerType = useSellerType();
  const seller = useSeller();
  const isBusiness = sellerType !== null && sellerType !== "PERSON";
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  // Pricing rows are per country. Without one the server returns no pricing at
  // all, which is the honest outcome — better a card with no price than a card
  // quoting another country's.
  const countryId = seller?.countryId ?? null;

  const { data: personData } = useQuery<{ personMemberships: MembershipRow[] }>(
    PERSON_MEMBERSHIPS,
    { variables: { countryId }, skip: isBusiness },
  );
  const { data: businessData } = useQuery<{
    businessMemberships: MembershipRow[];
  }>(BUSINESS_MEMBERSHIPS, { variables: { countryId }, skip: !isBusiness });

  const { data: currentData } = useQuery<{ mySubscription: MySubscription | null }>(
    MY_SUBSCRIPTION,
    { skip: !seller, fetchPolicy: "cache-and-network" },
  );

  const memberships = isBusiness
    ? businessData?.businessMemberships
    : personData?.personMemberships;

  const [createMembershipPayment] = useMutation<
    { createMembershipPayment: CreatePaymentResponse },
    { membershipId: number; returnUrl: string; provider: string }
  >(CREATE_MEMBERSHIP_PAYMENT);

  /** Start the payment for one term of the plan `planKey`. */
  const subscribe = async (planKey: string, term: PlanTerm): Promise<void> => {
    setPendingKey(planKey);
    try {
      const res = await createMembershipPayment({
        variables: {
          membershipId: Number(term.membershipId),
          returnUrl: paymentReturnUrl(DEFAULT_PAYMENT_PROVIDER),
          provider: DEFAULT_PAYMENT_PROVIDER,
        },
      });
      const redirect = res.data?.createMembershipPayment.redirect;
      if (!redirect) throw new Error("createMembershipPayment returned no redirect");

      if (redirect.kind === "WEBPAY_FORM") {
        submitWebpayForm(redirect.url, redirect.token);
      } else {
        window.location.assign(redirect.url);
      }
    } catch (err) {
      // The server's reason reaches the buyer, e.g. a lower plan while one runs.
      toast.error(err instanceof Error ? err.message : "Error");
      setPendingKey(null);
    }
  };

  /**
   * Every term on sale for a plan in the seller's country, shortest first.
   * Terms without a price there are left out: callers render the absence
   * rather than invent a number.
   */
  const termsFor = useCallback(
    (planKey: string): PlanTerm[] =>
      (memberships ?? [])
        .flatMap((m) =>
          m.membershipType === planKey && m.pricing
            ? [
                {
                  membershipId: m.id,
                  months: m.durationMonths,
                  price: m.pricing.price,
                  currency: m.pricing.currency,
                },
              ]
            : [],
        )
        .sort((a, b) => a.months - b.months),
    [memberships],
  );

  return {
    subscribe,
    pendingKey,
    termsFor,
    /** The seller's active membership, or null on the free tier. */
    current: currentData?.mySubscription ?? null,
    /** False until `current` has been asked, so the free tier isn't assumed early. */
    currentLoaded: currentData !== undefined,
  };
}
