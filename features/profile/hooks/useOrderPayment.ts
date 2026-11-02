"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import {
  DEFAULT_PAYMENT_PROVIDER,
  paymentReturnUrl,
} from "@/features/cart/constants/paymentProviders";
import { CREATE_PAYMENT } from "@/graphql/checkout/mutations";
import { useToast } from "@/hooks/useToast";
import { submitWebpayForm } from "@/lib/webpay";
import type { CreatePaymentInput, CreatePaymentResponse } from "@/types/checkout";

/**
 * Pays an order still waiting for payment, from the order history. Checkout
 * empties the seller's cart lines as it hands off to the provider, so a buyer
 * who left the provider's page comes back here. It starts a new payment for
 * the same order; transactions refunds any second charge on its own, so an
 * older attempt that still goes through can't charge the buyer twice.
 */
export function useOrderPayment() {
  const toast = useToast();
  // The order being paid, so only that card's button spins.
  const [payingId, setPayingId] = useState<string | null>(null);
  const [createPayment] = useMutation<
    { createPayment: CreatePaymentResponse },
    { input: CreatePaymentInput }
  >(CREATE_PAYMENT);

  const pay = async (orderId: string) => {
    setPayingId(orderId);
    try {
      const { data } = await createPayment({
        variables: {
          input: {
            orderId: Number(orderId),
            provider: DEFAULT_PAYMENT_PROVIDER,
            returnUrl: paymentReturnUrl(DEFAULT_PAYMENT_PROVIDER),
          },
        },
      });
      const redirect = data?.createPayment.redirect;
      if (!redirect) throw new Error("createPayment returned no data");
      if (redirect.kind === "WEBPAY_FORM") {
        submitWebpayForm(redirect.url, redirect.token);
      } else {
        window.location.assign(redirect.url);
      }
      // Leave the spinner on: the page is navigating away.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
      setPayingId(null);
    }
  };

  return { pay, payingId };
}
