"use client";
import { useMutation } from "@apollo/client/react";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { CREATE_ORDER, CREATE_PAYMENT } from "@/graphql/checkout/mutations";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useCartStore, { useCartGroups } from "@/store/useCartStore";
import type {
  CreateOrderInput,
  CreateOrderResponse,
  CreatePaymentInput,
  CreatePaymentResponse,
  PaymentProviderId,
  ShippingAddressInput,
  ShippingMethod,
} from "@/types/checkout";

import { submitWebpayForm } from "@/lib/webpay";

import { shippingMethodById } from "../constants/shippingMethods";
import { useShippingQuote } from "./useShippingQuote";

export type CheckoutStep = "shipping" | "payment" | "review";

const STEP_ORDER: CheckoutStep[] = ["shipping", "payment", "review"];

const emptyAddress = (): Partial<ShippingAddressInput> => ({});

export function useCheckout() {
  const { t } = useTranslation("cart");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const searchParams = useSearchParams();
  const { navigateTo } = useNavigation();
  const toast = useToast();

  // Checkout runs one seller group at a time. The cart's per-seller "Checkout"
  // buttons (and Buy now) pass `?g=<source>:<sellerId>`; if it's missing or
  // stale we fall back to the first remaining group so checkout never dead-ends.
  const groups = useCartGroups();
  const clearGroup = useCartStore((s) => s.clearGroup);
  const groupParam = searchParams.get("g");
  const group = useMemo(() => {
    if (groups.length === 0) return null;
    if (groupParam) return groups.find((g) => g.id === groupParam) ?? null;
    return groups[0];
  }, [groups, groupParam]);

  const items = group?.items ?? [];
  const subtotal = group?.subtotal ?? 0;
  const currency = group?.currency ?? "CLP";
  const count = group?.count ?? 0;
  const isEmpty = group === null;

  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [address, setAddress] = useState<Partial<ShippingAddressInput>>(emptyAddress);
  const [provider, setProvider] = useState<PaymentProviderId | null>(null);
  const [loading, setLoading] = useState(false);

  const [createOrder] = useMutation<{ createOrder: CreateOrderResponse }, { input: CreateOrderInput }>(
    CREATE_ORDER,
  );
  const [createPayment] = useMutation<
    { createPayment: CreatePaymentResponse },
    { input: CreatePaymentInput }
  >(CREATE_PAYMENT);

  const shippingQuote = useShippingQuote(shippingMethod);

  const isShippingValid = useMemo(() => {
    if (!shippingMethod) return false;
    const meta = shippingMethodById(shippingMethod);
    if (!meta.payable) return false; // mid-point flows out of the payable funnel.
    if (!meta.requiresAddress) return true;
    return Boolean(
      address.recipientName &&
        address.countryId &&
        address.regionId &&
        address.cityId &&
        address.countyId &&
        address.street &&
        address.phone,
    );
  }, [shippingMethod, address]);

  const isPaymentValid = Boolean(provider);

  const shippingCost = shippingQuote.status === "KNOWN" ? shippingQuote.amount : 0;
  const total = subtotal + shippingCost;

  const goNext = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx === -1) return;

    if (step === "shipping" && !isShippingValid) {
      toast.error(t("checkout.errors.missingShipping"));
      return;
    }
    if (step === "payment" && !isPaymentValid) {
      toast.error(t("checkout.errors.missingPayment"));
      return;
    }
    setStep(STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]);
  };

  const goBack = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx <= 0) return;
    setStep(STEP_ORDER[idx - 1]);
  };

  const pay = async () => {
    if (isEmpty) return;
    if (!shippingMethod) {
      toast.error(t("checkout.errors.missingShipping"));
      return;
    }
    if (!provider) {
      toast.error(t("checkout.errors.missingPayment"));
      return;
    }
    const meta = shippingMethodById(shippingMethod);
    if (!meta.payable) {
      toast.error(t("checkout.errors.midPointUnavailable"));
      return;
    }
    if (meta.requiresAddress && !isShippingValid) {
      toast.error(t("checkout.errors.missingAddress"));
      return;
    }

    setLoading(true);
    try {
      const orderRes = await createOrder({
        variables: {
          input: {
            // A cart group is single-source, so each line maps to the id field
            // its owning subgraph expects: marketplace → productId, store →
            // storeProductId. (Store cart items keep the StoreProduct id in
            // `productId` client-side.)
            items: items.map((i) =>
              i.source === "store"
                ? { storeProductId: i.productId, quantity: i.quantity }
                : { productId: i.productId, quantity: i.quantity },
            ),
            shippingMethod,
            shippingAddress: meta.requiresAddress
              ? (address as ShippingAddressInput)
              : undefined,
            currency,
          },
        },
      });
      const order = orderRes.data?.createOrder;
      if (!order) throw new Error("createOrder returned no data");

      const origin = typeof window === "undefined" ? "" : window.location.origin;
      // Route the provider return through the Next proxy → gateway, which commits
      // the payment (e.g. Webpay tx.commit) and only then 303s the buyer to
      // /{lang}/cart/confirmation?paymentId=…. Lowercase so it matches the
      // gateway's /payments/return/<provider> routes.
      const returnUrl = `${origin}/api/checkout/return/${provider.toLowerCase()}`;

      const paymentRes = await createPayment({
        variables: {
          // Order.id is a GraphQL ID (returned as a string), but createPayment's
          // orderId is an Int — coerce so variable validation doesn't reject it.
          input: { orderId: Number(order.id), provider, returnUrl },
        },
      });
      const result = paymentRes.data?.createPayment;
      if (!result) throw new Error("createPayment returned no data");

      // Hand off to the provider. Webpay requires an HTML form-POST with the
      // token; Khipu/MercadoPago accept a plain navigation.
      if (result.redirect.kind === "WEBPAY_FORM") {
        submitWebpayForm(result.redirect.url, result.redirect.token);
      } else {
        window.location.assign(result.redirect.url);
      }

      // Clear only this seller's lines after redirect kicks off — other sellers'
      // groups stay in the cart for their own checkout. If the user bails out we
      // don't want to also have lost their cart.
      if (group) clearGroup(group.source, group.sellerId);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : t("checkout.errors.createPaymentFailed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const goToMidPointChat = (sellerId?: string) => {
    if (!sellerId) return;
    const lang = params.lang ?? DEFAULT_LANGUAGE;
    // TODO: replace with the in-app chat route once it lands.
    navigateTo({ route: `/${lang}/seller/${sellerId}` });
  };

  return {
    step,
    setStep,
    goNext,
    goBack,

    shippingMethod,
    setShippingMethod,

    address,
    setAddress,
    updateAddressField: <K extends keyof ShippingAddressInput>(
      key: K,
      value: ShippingAddressInput[K] | undefined,
    ) => setAddress((prev) => ({ ...prev, [key]: value })),

    provider,
    setProvider,

    shippingQuote,
    shippingCost,
    subtotal,
    total,
    currency,

    // Active seller group being checked out.
    group,
    count,
    isEmpty,
    sellerName: group?.sellerName,
    source: group?.source,

    isShippingValid,
    isPaymentValid,
    loading,
    pay,
    goToMidPointChat,
  };
}
