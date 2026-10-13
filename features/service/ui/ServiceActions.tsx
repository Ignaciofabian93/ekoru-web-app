"use client";
import { CalendarPlus, Check, FileText, Heart, Share2, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/Primitives/Button";
import { FEATURES } from "@/constants/features";
import { buttonIconSize } from "@/design/button";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useShareProduct } from "@/hooks/useShareProduct";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";
import { ContactSellerButton } from "@/features/chat/ui/ContactSellerButton";
import { BookServiceDialog } from "./BookServiceDialog";
import { RequestQuoteDialog } from "./RequestQuoteDialog";

interface Props {
  lang: string;
  service: ServiceDetail;
}

export function ServiceActions({ service }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { toggleFavorite } = useToggleFavorite();
  const isOwnService = useIsOwnProduct(service.sellerId);
  const liked = Boolean(service.isLiked);
  const { share, copied } = useShareProduct({
    title: service.name,
    text: service.description ?? undefined,
  });

  const [bookingOpen, setBookingOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // A quote-priced service has no number to agree to up front, so it can only
  // be requested; anything with a price can be booked directly. Both are
  // offered when the provider prices by package or by the hour, where a buyer
  // may want a tailored figure before committing.
  //
  // Booking is on (WEB-5, paid on site); quotes still wait behind their switch.
  // See `constants/features.ts`.
  const quoteOnly = service.pricingType === "QUOTATION";
  const canBook = !quoteOnly && FEATURES.serviceBooking.available;
  const canRequestQuote = FEATURES.serviceQuotes.available;

  // The provider is reached through EKORU's chat (WEB-22), never a phone
  // number: their contact details stay private until there is a booking
  // (USR-14), so the conversation happens where it can turn into one. When the
  // service can be booked, booking stays the main action.
  const { t: tRoot } = useTranslation();

  return (
    <div className="flex flex-col gap-2.5">
      {isOwnService ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-4 py-3.5 text-sm font-medium text-foreground-secondary">
          <UserRound size={18} strokeWidth={2} className="shrink-0 text-primary" />
          {t("actions.ownListing")}
        </div>
      ) : (
        <>
          {canBook && (
            <Button
              text={t("actions.book")}
              leftIcon={CalendarPlus}
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setBookingOpen(true)}
            />
          )}

          <ContactSellerButton
            itemType="SERVICE"
            itemId={Number(service.id)}
            label={tRoot("chatActions.contactProvider")}
            variant={canBook ? "outline" : "primary"}
          />

          {canRequestQuote && (
            <Button
              text={t("actions.requestQuote")}
              leftIcon={FileText}
              variant={quoteOnly ? "primary" : "ghost"}
              size="md"
              fullWidth
              onClick={() => setQuoteOpen(true)}
            />
          )}
        </>
      )}

      {/* Secondary to the CTAs above, so both stay `outline` in either state —
          the filled heart and the label carry "saved", not a second color of
          button. `flex-1` rather than `fullWidth`: they share one row. */}
      <div className="flex gap-2">
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
          onPress={() => toggleFavorite(Number(service.id), liked, "service")}
        />
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          leftIcon={copied ? Check : Share2}
          text={t("actions.share")}
          onPress={share}
        />
      </div>

      {canBook && (
        <BookServiceDialog
          service={service}
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}
      {canRequestQuote && (
        <RequestQuoteDialog
          service={service}
          isOpen={quoteOpen}
          onClose={() => setQuoteOpen(false)}
        />
      )}
    </div>
  );
}
