"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  COMPLETE_MERCADOPAGO_CONNECTION,
  DISCONNECT_MERCADOPAGO,
  START_MERCADOPAGO_CONNECTION,
} from "@/graphql/payoutSetup/mutations";
import { MY_STORE_PAYMENT_SETUP } from "@/graphql/payoutSetup/queries";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import type { StorePaymentSetup } from "@/types/checkout";

import { NAMESPACE } from "../i18n";

const messageOf = (error: unknown) => (error instanceof Error ? error.message : "");

/**
 * A business's Mercado Pago connection and what it can do with it (WEB-2).
 * Connecting is a round trip: `connect` sends the browser to Mercado Pago,
 * which returns it to /profile/payments with `code` and `state`; this hook
 * finishes the connection once and cleans the URL, because a code works only
 * once.
 */
export function usePayoutSetup({ lang, enabled }: { lang: string; enabled: boolean }) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const router = useRouter();

  const { data, loading, refetch } = useQuery<{ myStorePaymentSetup: StorePaymentSetup }>(
    MY_STORE_PAYMENT_SETUP,
    { skip: !enabled, fetchPolicy: "cache-and-network" },
  );
  const [startM, start] = useMutation<{ startMercadoPagoConnection: string }>(
    START_MERCADOPAGO_CONNECTION,
  );
  const [completeM, complete] = useMutation<{
    completeMercadoPagoConnection: StorePaymentSetup;
  }>(COMPLETE_MERCADOPAGO_CONNECTION);
  const [disconnectM, disconnect] = useMutation<{
    disconnectMercadoPago: StorePaymentSetup;
  }>(DISCONNECT_MERCADOPAGO);

  const handled = useRef(false);

  // Back from Mercado Pago: ?code=…&state=… (or ?error=… when the business declined).
  useEffect(() => {
    if (!enabled || handled.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const declined = params.get("error");
    if (!code && !declined) return;
    handled.current = true;
    const clean = () => router.replace(`/${lang}/profile/payments`);

    if (declined || !code || !state) {
      toast.error(t("payouts.feedback.declined"));
      clean();
      return;
    }
    completeM({ variables: { oauthCode: code, oauthState: state } })
      .then(async () => {
        toast.success(t("payouts.feedback.connected"));
        await refetch();
      })
      .catch((error: unknown) =>
        toast.error(messageOf(error) || t("payouts.feedback.error")),
      )
      .finally(clean);
  }, [completeM, enabled, lang, refetch, router, t, toast]);

  const connect = async () => {
    try {
      const { data: started } = await startM();
      const url = started?.startMercadoPagoConnection;
      if (!url) throw new Error(t("payouts.feedback.error"));
      window.location.assign(url);
    } catch (error) {
      toast.error(messageOf(error) || t("payouts.feedback.error"));
    }
  };

  const unlink = async () => {
    if (!window.confirm(t("payouts.disconnectConfirm"))) return;
    try {
      await disconnectM();
      toast.success(t("payouts.feedback.disconnected"));
      await refetch();
    } catch (error) {
      toast.error(messageOf(error) || t("payouts.feedback.error"));
    }
  };

  return {
    setup: data?.myStorePaymentSetup ?? null,
    loading: loading && !data,
    // Back from Mercado Pago and still exchanging the code.
    finishing: complete.loading,
    busy: start.loading || complete.loading || disconnect.loading,
    connect,
    unlink,
  };
}
