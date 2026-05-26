"use client";

import { Check, Heart, Share2, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useCartStore from "@/store/useCartStore";
import type { Product } from "@/types/product";

import { NAMESPACE } from "../i18n";
import { useShareProduct } from "../hooks/useShareProduct";

interface Props {
  lang: string;
  product: Product;
}

function resolveSellerName(product: Product): string | undefined {
  const profile = product.seller?.profile;
  if (!profile) return undefined;
  if (profile.__typename === "PersonProfile") {
    return (
      profile.displayName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
      undefined
    );
  }
  return profile.businessName ?? undefined;
}

export function ProductActions({ lang, product }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const router = useRouter();
  const toast = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const { share, copied } = useShareProduct({
    title: product.name,
    text: product.description,
  });

  const unitPrice =
    product.hasOffer && product.offerPrice ? product.offerPrice : product.price;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0],
      unitPrice,
      currency: "CLP",
      sellerId: product.sellerId,
      sellerName: resolveSellerName(product),
    });
    setAdded(true);
    toast.success(t("actions.added"));
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push(`/${lang}/cart/checkout`);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-colors ${
            added
              ? "bg-success text-white"
              : "bg-primary text-white hover:opacity-90"
          }`}
        >
          {added ? <Check size={20} strokeWidth={2.2} /> : <ShoppingCart size={20} strokeWidth={2} />}
          {added ? t("actions.added") : t("actions.addToCart")}
        </button>
        <Link
          href={`/${lang}/cart`}
          aria-label={t("actions.viewCart")}
          className="flex w-14 items-center justify-center rounded-xl border-2 border-primary text-primary transition-colors hover:bg-primary-light-bg"
        >
          <ShoppingCart size={20} strokeWidth={2} />
        </Link>
      </div>

      <button
        type="button"
        onClick={handleBuyNow}
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-base font-semibold text-foreground transition-colors hover:bg-background-secondary"
      >
        <Zap size={18} strokeWidth={2} />
        {t("actions.buyNow")}
      </button>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
            saved
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-border bg-surface text-foreground-secondary hover:bg-background-secondary"
          }`}
        >
          <Heart
            size={16}
            strokeWidth={2}
            className={saved ? "fill-red-500 text-red-500" : ""}
          />
          {saved ? t("actions.saved") : t("actions.save")}
        </button>
        <button
          type="button"
          onClick={share}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary"
        >
          {copied ? <Check size={16} strokeWidth={2.2} /> : <Share2 size={16} strokeWidth={2} />}
          {t("actions.share")}
        </button>
      </div>
    </div>
  );
}
