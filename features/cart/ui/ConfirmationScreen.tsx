"use client";
import { useSearchParams } from "next/navigation";

import { type SupportedLanguage } from "@/constants/settings";

import { usePaymentStatus } from "../hooks/usePaymentStatus";
import { ConfirmationStatus } from "./ConfirmationStatus";

export function ConfirmationScreen({ lang }: { lang: SupportedLanguage }) {
  const searchParams = useSearchParams();
  // Different providers return the buyer with a different param. Accept the
  // common ones so the URL the gateway picks doesn't matter to the client.
  const paymentId =
    searchParams.get("paymentId") ??
    searchParams.get("payment_id") ??
    searchParams.get("token_ws") ??
    null;

  const { payment, loading } = usePaymentStatus(paymentId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10">
      <ConfirmationStatus lang={lang} payment={payment} loading={loading} />
    </div>
  );
}
