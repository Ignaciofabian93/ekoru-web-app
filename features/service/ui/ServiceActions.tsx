"use client";
import {
  CalendarPlus,
  Check,
  FileText,
  Heart,
  Phone,
  Share2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import clsx from "clsx";

import { Button } from "@/components/Primitives/Button";
import { FEATURES } from "@/constants/features";
import { buttonClass, buttonIconSize } from "@/design/button";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useShareProduct } from "@/hooks/useShareProduct";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";
import { BookServiceDialog } from "./BookServiceDialog";
import { RequestQuoteDialog } from "./RequestQuoteDialog";

interface Props {
  lang: string;
  service: ServiceDetail;
}

/** Button looks for the anchors that stand in for one. */
const primaryLinkClass = clsx(buttonClass.primary.md, "gap-2");
const outlineLinkClass = clsx(buttonClass.outline.md, "gap-2");

export function ServiceActions({ lang, service }: Props) {
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

  // Contacting the provider directly skips EKORU: no booking, no points, no
  // record. So when the service can be booked, booking is the main action and
  // the contact route steps back to a secondary one. Without booking it stays
  // primary: a published phone number, or else the provider's page.
  const phone = service.seller?.phone;
  const providerHref = `/${lang}/seller/${service.sellerId}`;
  const contactLinkClass = clsx(canBook ? outlineLinkClass : primaryLinkClass, "w-full");

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

          {/* The contact route is a link, not a button — it gets a button's
              footprint from the same design module so it sits flush with the
              CTAs around it. */}
          {phone ? (
            <a href={`tel:${phone}`} className={contactLinkClass}>
              <Phone size={buttonIconSize.md} strokeWidth={2} aria-hidden />
              {t("actions.contactProvider")}
            </a>
          ) : (
            <Link href={providerHref} className={contactLinkClass}>
              <UserRound size={buttonIconSize.md} strokeWidth={2} aria-hidden />
              {t("actions.viewProvider")}
            </Link>
          )}

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
