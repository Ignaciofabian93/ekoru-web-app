"use client";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

import { GET_PAYMENT_STATUS } from "@/graphql/checkout/queries";
import type { PaymentStatusResponse } from "@/types/checkout";

const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "EXPIRED",
]);

type Result = {
  payment: PaymentStatusResponse | null;
  loading: boolean;
  isTerminal: boolean;
};

/**
 * Polls the gateway for payment status while the buyer sits on the
 * confirmation screen. Stops once the status reaches a terminal state.
 */
export function usePaymentStatus(paymentId: string | null): Result {
  const { data, loading, startPolling, stopPolling } = useQuery<{
    payment: PaymentStatusResponse;
  }>(GET_PAYMENT_STATUS, {
    variables: { paymentId },
    skip: !paymentId,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const status = data?.payment?.status;
  const isTerminal = !!status && TERMINAL_STATUSES.has(status);

  useEffect(() => {
    if (!paymentId) return;
    if (isTerminal) {
      stopPolling();
      return;
    }
    startPolling(3000);
    return () => stopPolling();
  }, [paymentId, isTerminal, startPolling, stopPolling]);

  return { payment: data?.payment ?? null, loading, isTerminal };
}
