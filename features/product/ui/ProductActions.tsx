"use client";
import { Check, HandCoins, Heart, PackageCheck, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDealActions } from "@/features/deals/hooks/useDealActions";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useIsAuthenticated } from "@/store/useAuthStore";
import { useTranslation } from "@/i18n/context";
import type { Product } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { useShareProduct } from "../../../hooks/useShareProduct";

interface Props {
  lang: string;
  product: Product;
}

export function ProductActions({ lang, product }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { toggleFavorite } = useToggleFavorite();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  const isAuthed = useIsAuthenticated();
  // Marketplace is cash + in person, so the primary action starts a P2P deal
  // (a purchase request), not an online cart checkout.
  const { proposeSaleDeal, busyId } = useDealActions();
  const requesting = busyId === product.id;
  const [requested, setRequested] = useState(false);
  const liked = Boolean(product.isLiked);
  const { share, copied } = useShareProduct({
    title: product.name,
    text: product.description,
  });

  async function handleRequestToBuy() {
    const deal = await proposeSaleDeal(product.id);
    if (deal) setRequested(true);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {isOwnProduct ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-4 py-3.5 text-sm font-medium text-foreground-secondary">
          <PackageCheck size={18} strokeWidth={2} className="shrink-0 text-primary" />
          {t("actions.ownListing")}
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRequestToBuy}
              disabled={requesting || requested || !isAuthed}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-colors disabled:cursor-not-allowed ${
                requested
                  ? "bg-success/15 text-success"
                  : "bg-primary text-white hover:opacity-90 disabled:opacity-50"
              }`}
            >
              {requested ? (
                <Check size={20} strokeWidth={2.2} />
              ) : (
                <HandCoins size={20} strokeWidth={2} />
              )}
              {requested
                ? t("actions.requested")
                : requesting
                  ? t("actions.requesting")
                  : isAuthed
                    ? t("actions.requestToBuy")
                    : t("actions.loginToBuy")}
            </button>
            <Link
              href={`/${lang}/deals`}
              aria-label={t("actions.viewDeals")}
              className="flex w-14 items-center justify-center rounded-xl border-2 border-primary text-primary transition-colors hover:bg-primary-light-bg"
            >
              <PackageCheck size={20} strokeWidth={2} />
            </Link>
          </div>
          <p className="text-center text-xs text-foreground-tertiary">
            {t("actions.cashHint")}
          </p>
        </>
      )}

      <div className="flex gap-2">
        {!isOwnProduct && (
          <button
            type="button"
            onClick={() => toggleFavorite(product.id, liked)}
            aria-pressed={liked}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
              liked
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-border bg-surface text-foreground-secondary hover:bg-background-secondary"
            }`}
          >
            <Heart
              size={16}
              strokeWidth={2}
              className={liked ? "fill-red-500 text-red-500" : ""}
            />
            {liked ? t("actions.saved") : t("actions.save")}
          </button>
        )}
        <button
          type="button"
          onClick={share}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary"
        >
          {copied ? (
            <Check size={16} strokeWidth={2.2} />
          ) : (
            <Share2 size={16} strokeWidth={2} />
          )}
          {t("actions.share")}
        </button>
      </div>
    </div>
  );
}
