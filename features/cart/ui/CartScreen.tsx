"use client";
import { ArrowLeft, Info, Trash2 } from "lucide-react";

import { LinkButton } from "@/components/Primitives/LinkButton";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useCartGroups } from "@/store/useCartStore";

import { useCart } from "../hooks/useCart";
import { CartList } from "./CartList";
import { EmptyCart } from "./EmptyCart";

/**
 * Fills the page shell's `wide` column (`screens/Cart`); the shell owns the
 * gutters and vertical padding, so nothing here sets its own width.
 */
export function CartScreen({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation("cart");
  const { count, isEmpty, clear, isHydrated } = useCart();
  const groups = useCartGroups();

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
      ? t("cart.itemCount", { count: "1" })
      : t("cart.itemCountPlural", { count: String(count) });
  const sellerCountLabel =
    groups.length === 1
      ? t("cart.sellerCount", { count: "1" })
      : t("cart.sellerCountPlural", { count: String(groups.length) });

  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Title level="h1" size="h3" weight="bold">
            {t("cart.title")}
          </Title>
          <Text variant="p" size="base" color="secondary">
            {itemCountLabel} · {sellerCountLabel}
          </Text>
        </div>

        <div className="flex items-center justify-between gap-4 md:justify-end">
          <LinkButton
            href={`/${lang}/stores`}
            icon={ArrowLeft}
            variant="ghost"
            size="md"
            label={t("cart.actions.continueShopping")}
          />
          <button
            type="button"
            onClick={clear}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 font-sans text-sm font-semibold text-danger outline-none hover:bg-danger/5 focus-visible:ring-2 focus-visible:ring-danger"
          >
            <Trash2 size={14} strokeWidth={2.5} aria-hidden />
            {t("cart.actions.clear")}
          </button>
        </div>
      </header>

      {/* Several sellers means several payments; say so before the buyer
          meets a second pay button and wonders which one is "the" checkout. */}
      {groups.length > 1 ? (
        <div className="flex items-start gap-3 rounded-2xl border border-secondary-dark/30 bg-secondary/10 px-4 py-3.5">
          <Info
            size={18}
            strokeWidth={2}
            aria-hidden
            className="mt-0.5 shrink-0 text-secondary-dark"
          />
          <Text variant="p" size="sm" color="secondary">
            {t("cart.splitNotice", { count: String(groups.length) })}
          </Text>
        </div>
      ) : null}

      <CartList lang={lang} />
    </div>
  );
}
