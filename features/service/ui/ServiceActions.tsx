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

/** The primary button's look, for the anchors that stand in for one. */
const primaryLinkClass = clsx(buttonClass.primary.md, "gap-2");

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
  // Beta: both are switched off, so the panel is browse-and-contact only. The
  // contact route below is unaffected — it was never transacted on Ekoru, and
  // it's the whole point of a service listing. See `constants/features.ts`.
  const quoteOnly = service.pricingType === "QUOTATION";
  const canBook = !quoteOnly && FEATURES.serviceBooking.available;
  const canRequestQuote = FEATURES.serviceQuotes.available;

  // Nothing is transacted on Ekoru for a service: the buyer has to reach the
  // provider. A published phone number is the direct route; otherwise the
  // provider's page is the only place to find their contact details.
  const phone = service.seller?.phone;
  const providerHref = `/${lang}/seller/${service.sellerId}`;

  return (
    <div className="flex flex-col gap-2.5">
      {isOwnService ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-4 py-3.5 text-sm font-medium text-foreground-secondary">
          <UserRound size={18} strokeWidth={2} className="shrink-0 text-primary" />
          {t("actions.ownListing")}
        </div>
      ) : (
        <>
          {/* The contact route is a link, not a button — it gets the primary
              button's footprint from the same design module so it sits flush
              with the CTAs under it. */}
          {phone ? (
            <a href={`tel:${phone}`} className={clsx(primaryLinkClass, "w-full")}>
              <Phone size={buttonIconSize.md} strokeWidth={2} aria-hidden />
              {t("actions.contactProvider")}
            </a>
          ) : (
            <Link href={providerHref} className={clsx(primaryLinkClass, "w-full")}>
              <UserRound size={buttonIconSize.md} strokeWidth={2} aria-hidden />
              {t("actions.viewProvider")}
            </Link>
          )}

          {canBook && (
            <Button
              text={t("actions.book")}
              leftIcon={CalendarPlus}
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setBookingOpen(true)}
            />
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
