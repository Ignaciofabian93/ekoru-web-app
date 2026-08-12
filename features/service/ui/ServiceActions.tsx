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

import { Button } from "@/components/Primitives/Button";
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
  const quoteOnly = service.pricingType === "QUOTATION";
  const canBook = !quoteOnly;

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
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition-colors hover:opacity-90"
            >
              <Phone size={20} strokeWidth={2} />
              {t("actions.contactProvider")}
            </a>
          ) : (
            <Link
              href={providerHref}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition-colors hover:opacity-90"
            >
              <UserRound size={20} strokeWidth={2} />
              {t("actions.viewProvider")}
            </Link>
          )}

          {canBook && (
            <Button
              text={t("actions.book")}
              leftIcon={CalendarPlus}
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => setBookingOpen(true)}
            />
          )}

          <Button
            text={t("actions.requestQuote")}
            leftIcon={FileText}
            variant={quoteOnly ? "primary" : "ghost"}
            size="lg"
            fullWidth
            onClick={() => setQuoteOpen(true)}
          />
        </>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toggleFavorite(Number(service.id), liked, "service")}
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

      <BookServiceDialog
        service={service}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
      <RequestQuoteDialog
        service={service}
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />
    </div>
  );
}
