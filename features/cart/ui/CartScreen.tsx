"use client";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";

import { useCart } from "../hooks/useCart";
import { CartList } from "./CartList";
import { EmptyCart } from "./EmptyCart";

export function CartScreen({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");
  const { count, isEmpty, clear, isHydrated } = useCart();

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
    </div>
  );
}
