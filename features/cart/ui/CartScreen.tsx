"use client";
import Link from "next/link";

import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { formatPrice } from "@/data/products";
import { useTranslation } from "@/i18n/context";

import { useCart } from "../hooks/useCart";
import { CartList } from "./CartList";
import { EmptyCart } from "./EmptyCart";

export function CartScreen({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");
  const { items, count, subtotal, isEmpty, currency, clear, isHydrated } = useCart();

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

  const itemCountLabel =
    count === 1
      ? t("cart.itemCount", { count: String(count) })
      : t("cart.itemCountPlural", { count: String(count) });

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex flex-col">
            <Title level="h1" size="h4" weight="semibold">
              {t("cart.title")}
            </Title>
            <Text variant="small" color="secondary">
              {itemCountLabel}
            </Text>
          </div>
          <button
            type="button"
            onClick={clear}
            className="cursor-pointer font-sans text-xs font-semibold text-danger hover:underline"
          >
            {t("cart.actions.clear")}
          </button>
        </div>

        <CartList />
      </div>

      <div className="sticky bottom-0 border-t border-border-light bg-surface px-4 py-4">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <Text variant="span" weight="semibold">
              {t("checkout.summary.subtotal")}
            </Text>
            <Text variant="span" weight="bold" size="lg">
              {formatPrice(subtotal, currency)}
            </Text>
          </div>
          <Link
            href={`/${lang}/cart/checkout`}
            aria-disabled={items.length === 0}
            className="block w-full rounded-xl bg-primary py-3.5 text-center font-sans font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            {t("cart.actions.proceed")}
          </Link>
        </div>
      </div>
    </div>
  );
}
