"use client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { CREATE_QUOTATION_PAYMENT } from "@/graphql/checkout/mutations";
import { useToast } from "@/hooks/useToast";
import { submitWebpayForm } from "@/lib/webpay";
import type { CreatePaymentResponse } from "@/types/checkout";

/** Whether the client can pay this quote now: what transactions checks too. */
export function isPayable(quotation: {
  status: string;
  paidAt?: string | null;
  finalPrice?: number | null;
  estimatedPrice?: number | null;
}): boolean {
  const price = quotation.finalPrice ?? quotation.estimatedPrice;
  return quotation.status === "ACCEPTED" && !quotation.paidAt && (price ?? 0) > 0;
}

/**
 * Pays an accepted quote through Webpay (WEB-4). Same hand-off as checkout:
 * the provider returns through `/api/checkout/return/webpay`, the gateway
 * commits the payment and lands the client on `/cart/confirmation`, which
 * recognizes a quote payment and links back to the quotes inbox.
 */
export function useQuotationPayment() {
  const toast = useToast();
  // The id being paid, so only that card's button spins.
  const [payingId, setPayingId] = useState<string | null>(null);
  const [createQuotationPayment] = useMutation<{
    createQuotationPayment: Pick<CreatePaymentResponse, "paymentId" | "status" | "redirect">;
  }>(CREATE_QUOTATION_PAYMENT);

  const pay = async (quotationId: string) => {
    setPayingId(quotationId);
    try {
      const { data } = await createQuotationPayment({
        variables: {
          quotationId: Number(quotationId),
          returnUrl: `${window.location.origin}/api/checkout/return/webpay`,
          provider: "WEBPAY",
        },
      });
      const redirect = data?.createQuotationPayment.redirect;
      if (!redirect) throw new Error("createQuotationPayment returned no data");
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
