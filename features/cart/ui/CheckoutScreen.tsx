"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";

import MainButton from "@/components/Button/MainButton";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { formatPrice } from "@/data/products";
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

export function CheckoutScreen({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");
  const { isEmpty, isHydrated, count } = useCart();
  const checkout = useCheckout();

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
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6">
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
            {t("checkout.subtitle")}
          </Text>
        </div>
        <CheckoutStepper current={checkout.step} />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {checkout.step === "shipping" ? (
            <>
              <ShippingMethodPicker
                value={checkout.shippingMethod}
                onChange={checkout.setShippingMethod}
              />
              {isMidPoint ? (
                <MidPointNotice onContactSeller={checkout.goToMidPointChat} />
              ) : showAddressForm ? (
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
            <section className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-4">
              <Title level="h2" size="h5" weight="semibold">
                {t("checkout.steps.review")}
              </Title>
              <Text variant="small" color="secondary">
                {t("checkout.payment.redirectNotice", {
                  provider: checkout.provider
                    ? t(`checkout.payment.providers.${checkout.provider}`)
                    : "",
                })}
              </Text>
            </section>
          ) : null}

          <nav className="flex items-center justify-between gap-3">
            {checkout.step !== "shipping" ? (
              <MainButton
                variant="outline"
                size="md"
                text={t("checkout.back")}
                leftIcon={ArrowLeft}
                onPress={checkout.goBack}
              />
            ) : (
              <span />
            )}

            {checkout.step !== "review" ? (
              <MainButton
                variant="primary"
                size="md"
                text={t("checkout.actions.continue")}
                rightIcon={ArrowRight}
                onPress={checkout.goNext}
                disabled={
                  (checkout.step === "shipping" && !checkout.isShippingValid) ||
                  (checkout.step === "payment" && !checkout.isPaymentValid)
                }
              />
            ) : (
              <MainButton
                variant="primary"
                size="md"
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
          </nav>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OrderSummary
            itemCount={count}
            subtotal={checkout.subtotal}
            shipping={checkout.shippingQuote}
            total={checkout.total}
            currency={checkout.currency}
          />
        </aside>
      </div>
    </div>
  );
}
