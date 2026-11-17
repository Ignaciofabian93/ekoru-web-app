"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardCheck, Lock } from "lucide-react";

import { SectionCard } from "@/components/Patterns/SectionCard";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";

import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import { shippingMethodById } from "../constants/shippingMethods";
import { CheckoutStepper } from "./CheckoutStepper";
import { EmptyCart } from "./EmptyCart";
import { MidPointNotice } from "./MidPointNotice";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethodPicker } from "./PaymentMethodPicker";
import { ShippingAddressForm } from "./ShippingAddressForm";
import { ShippingMethodPicker } from "./ShippingMethodPicker";

/**
 * Laid out like the cart, so moving from one to the other keeps everything in
 * place: the step on the left, the order summary on the right, and the step's
 * actions inside the summary box — where the cart has its pay button.
 */
export function CheckoutScreen({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");
  const formatPrice = useFormatPrice();
  const { isHydrated } = useCart();
  const checkout = useCheckout();
  const { isEmpty, count } = checkout;

  if (!isHydrated) {
    return (
      <div
        aria-label={t("a11y.loading")}
        className="flex flex-1 items-center justify-center px-6 py-20"
      >
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isEmpty) return <EmptyCart lang={lang} />;

  const methodMeta = checkout.shippingMethod
    ? shippingMethodById(checkout.shippingMethod)
    : null;
  const showAddressForm = methodMeta?.requiresAddress ?? false;
  const isMidPoint = checkout.shippingMethod === "IN_MID_POINT_PICKUP";

  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-3">
        <Link
          href={`/${lang}/cart`}
          className="inline-flex items-center gap-1 self-start font-sans text-sm font-medium text-foreground-secondary hover:text-foreground"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          {t("checkout.back")}
        </Link>
        <div className="flex flex-col gap-1">
          <Title level="h1" size="h3" weight="bold">
            {t("checkout.title")}
          </Title>
          <Text variant="p" color="secondary">
            {checkout.sellerName
              ? t("checkout.sellerSubtitle", { seller: checkout.sellerName })
              : t("checkout.subtitle")}
          </Text>
        </div>
        <CheckoutStepper current={checkout.step} />
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-6">
          {checkout.step === "shipping" ? (
            <>
              <ShippingMethodPicker
                value={checkout.shippingMethod}
                onChange={checkout.setShippingMethod}
              >
                {isMidPoint ? (
                  <MidPointNotice onContactSeller={checkout.goToMidPointChat} />
                ) : null}
              </ShippingMethodPicker>
              {showAddressForm ? (
                <ShippingAddressForm
                  value={checkout.address}
                  onChange={checkout.updateAddressField}
                />
              ) : null}
            </>
          ) : null}

          {checkout.step === "payment" ? (
            <PaymentMethodPicker
              value={checkout.provider}
              currency={checkout.currency}
              onChange={checkout.setProvider}
            />
          ) : null}

          {checkout.step === "review" ? (
            <SectionCard
              title={t("checkout.steps.review")}
              icon={ClipboardCheck}
              tone="primary"
            >
              <Text variant="small" color="secondary">
                {t("checkout.payment.redirectNotice", {
                  provider: checkout.provider
                    ? t(`checkout.payment.providers.${checkout.provider}`)
                    : "",
                })}
              </Text>
            </SectionCard>
          ) : null}
        </div>

        {/* Same column and breakpoints as the cart's summary (`CartList`). */}
        <div className="md:w-96 md:justify-self-end lg:sticky lg:top-6 lg:w-auto lg:justify-self-stretch">
          <OrderSummary
            itemCount={count}
            subtotal={checkout.subtotal}
            shipping={checkout.shippingQuote}
            total={checkout.total}
            currency={checkout.currency}
          >
            <nav aria-label={t("a11y.checkoutSteps")} className="flex flex-col gap-2">
              {checkout.step !== "review" ? (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  text={t("checkout.actions.continue")}
                  rightIcon={ArrowRight}
                  onPress={checkout.goNext}
                  disabled={
                    (checkout.step === "shipping" && !checkout.isShippingValid) ||
                    (checkout.step === "payment" && !checkout.isPaymentValid)
                  }
                />
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  text={t("checkout.actions.pay", {
                    amount: formatPrice(checkout.total, checkout.currency),
                  })}
                  loadingText={t("checkout.actions.paying")}
                  loading={checkout.loading}
                  leftIcon={Lock}
                  onPress={checkout.pay}
                  disabled={!checkout.isShippingValid || !checkout.isPaymentValid}
                />
              )}

              {checkout.step !== "shipping" ? (
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  text={t("checkout.actions.previous")}
                  leftIcon={ArrowLeft}
                  onPress={checkout.goBack}
                />
              ) : null}
            </nav>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
