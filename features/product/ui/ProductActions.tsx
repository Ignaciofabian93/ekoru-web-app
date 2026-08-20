"use client";
import { Check, HandCoins, Heart, PackageCheck, Repeat, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Primitives/Button";
import { buttonIconSize } from "@/design/button";
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
  /**
   * Opens the exchange proposal in place of this panel. Omit it and the
   * exchange CTA is left off — there would be nowhere for it to lead.
   */
  onProposeExchange?: () => void;
}

export function ProductActions({ product, onProposeExchange }: Props) {
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

  // An exchangeable listing can still be bought outright, so the swap is a
  // second CTA rather than a replacement for the first.
  const canExchange = product.isExchangeable && !isOwnProduct && onProposeExchange;

  return (
    <div className="flex flex-col gap-2.5">
      {isOwnProduct ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-4 py-3.5 text-sm font-medium text-foreground-secondary">
          <PackageCheck size={18} strokeWidth={2} className="shrink-0 text-primary" />
          {t("actions.ownListing")}
        </div>
      ) : (
        <>
          <Button
            variant="primary"
            size="md"
            fullWidth
            leftIcon={requested ? Check : HandCoins}
            disabled={requesting || requested || !isAuthed}
            text={
              requested
                ? t("actions.requested")
                : requesting
                  ? t("actions.requesting")
                  : isAuthed
                    ? t("actions.requestToBuy")
                    : t("actions.loginToBuy")
            }
            onPress={handleRequestToBuy}
          />

          {canExchange && (
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={Repeat}
              text={t("exchange.title")}
              onPress={onProposeExchange}
            />
          )}

          <p className="text-center text-xs text-foreground-tertiary">
            {t("actions.cashHint")}
          </p>
        </>
      )}

      {/* Secondary to the CTAs above, so both stay `outline` in either state —
          the filled heart and the label carry "saved", not a second color of
          button. `flex-1` rather than `fullWidth`: they share one row. */}
      <div className="flex gap-2">
        {!isOwnProduct && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            ariaPressed={liked}
            leftIcon={
              <Heart
                size={buttonIconSize.sm}
                strokeWidth={2}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
            }
            text={liked ? t("actions.saved") : t("actions.save")}
            onPress={() => toggleFavorite(product.id, liked)}
          />
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          leftIcon={copied ? Check : Share2}
          text={t("actions.share")}
          onPress={share}
        />
      </div>
    </div>
  );
}
