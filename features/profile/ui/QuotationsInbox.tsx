"use client";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { Check, FileText, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { NAMESPACE } from "../i18n";
import {
  useMyQuotations,
  type Quotation,
  type QuotationStatus,
} from "../hooks/useServiceRequests";

const STATUS_TONE: Record<QuotationStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  ACCEPTED: "bg-success/10 text-success",
  DECLINED: "bg-danger/10 text-danger",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-foreground-tertiary/10 text-foreground-secondary",
  EXPIRED: "bg-foreground-tertiary/10 text-foreground-secondary",
};

type Tab = "received" | "sent";

function formatMoney(value: number, lang: string) {
  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `CLP ${value}`;
  }
}

/** Provider-side reply: put a price and terms on a pending request. */
function RespondForm({
  quotation,
  onSubmit,
  loading,
}: {
  quotation: Quotation;
  onSubmit: (input: {
    id: string;
    estimatedPrice?: number;
    estimatedDuration?: number;
    providerNotes?: string;
  }) => void;
  loading: boolean;
}) {
  const { t } = useTranslation(NAMESPACE);
  const [price, setPrice] = useState(
    quotation.estimatedPrice ? String(quotation.estimatedPrice) : "",
  );
  const [duration, setDuration] = useState(
    quotation.estimatedDuration ? String(quotation.estimatedDuration) : "",
  );
  const [notes, setNotes] = useState(quotation.providerNotes ?? "");

  const priceValue = Number(price);
  const isValid = price.trim().length > 0 && Number.isFinite(priceValue) && priceValue > 0;

  return (
    <form
      className="flex flex-col gap-3 border-t border-border-light pt-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({
          id: quotation.id,
          estimatedPrice: priceValue,
          estimatedDuration: duration ? Number(duration) : undefined,
          providerNotes: notes.trim() || undefined,
        });
      }}
    >
      <div className="flex flex-wrap gap-3">
        <Input
          name={`price-${quotation.id}`}
          type="number"
          label={t("quotes.respond.price")}
          value={price}
          onChangeText={setPrice}
          min={0}
          required
        />
        <Input
          name={`duration-${quotation.id}`}
          type="number"
          label={t("quotes.respond.duration")}
          value={duration}
          onChangeText={setDuration}
          min={0}
        />
      </div>
      <TextArea
        name={`notes-${quotation.id}`}
        label={t("quotes.respond.notes")}
        placeholder={t("quotes.respond.notesPlaceholder")}
        value={notes}
        onChangeText={setNotes}
        rows={3}
        maxLength={1000}
      />
      <Button
        text={t("quotes.respond.submit")}
        type="submit"
        size="sm"
        loading={loading}
        disabled={!isValid}
      />
    </form>
  );
}

export function QuotationsInbox() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const [tab, setTab] = useState<Tab>("sent");
  const {
    received,
    sent,
    loading,
    error,
    accept,
    decline,
    respond,
    accepting,
    declining,
    responding,
  } = useMyQuotations();

  const list = tab === "received" ? received : sent;

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border-light bg-background-secondary"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="prominent"
        icon={FileText}
        title={t("quotes.error.title")}
        description={t("quotes.error.description")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {(["sent", "received"] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === key
                ? "bg-primary text-on-primary"
                : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
            )}
          >
            {t(`quotes.tabs.${key}`)}
            {key === "received" && received.length > 0 ? ` (${received.length})` : ""}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          variant="prominent"
          icon={FileText}
          title={t(`quotes.empty.${tab}.title`)}
          description={t(`quotes.empty.${tab}.description`)}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((quotation) => {
            const isProviderView = tab === "received";
            // A quote only becomes a decision once the provider has put a
            // number on it; until then the client has nothing to accept.
            const price = quotation.finalPrice ?? quotation.estimatedPrice;
            const hasPrice = price !== null && price !== undefined;
            return (
              <article
                key={quotation.id}
                className="flex flex-col gap-3 rounded-2xl border border-border-light bg-surface p-5"
              >
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Title level="h3" size="h6" weight="semibold">
                      {quotation.title}
                    </Title>
                    {quotation.service && (
                      <Link
                        href={`/${lang}/service/${quotation.service.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {quotation.service.name}
                      </Link>
                    )}
                  </div>
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      STATUS_TONE[quotation.status],
                    )}
                  >
                    {t(`quotes.status.${quotation.status}`)}
                  </span>
                </header>

                <Text variant="p" size="sm" color="tertiary">
                  {quotation.description}
                </Text>

                {hasPrice && (
                  <div className="flex flex-col">
                    <Text variant="span" size="xs" color="tertiary">
                      {t("quotes.card.quotedPrice")}
                    </Text>
                    <Text variant="span" weight="bold" size="lg">
                      {formatMoney(price, lang)}
                    </Text>
                  </div>
                )}

                {quotation.providerNotes && (
                  <Text variant="p" size="sm" color="tertiary">
                    {t("quotes.card.providerNotes")}: {quotation.providerNotes}
                  </Text>
                )}

                {/* The client decides only once there is a price to decide on. */}
                {!isProviderView && quotation.status === "PENDING" && hasPrice && (
                    <div className="flex flex-wrap gap-2 border-t border-border-light pt-3">
                      <Button
                        text={t("quotes.card.accept")}
                        leftIcon={Check}
                        size="sm"
                        loading={accepting}
                        onClick={() => void accept(quotation.id)}
                      />
                      <Button
                        text={t("quotes.card.decline")}
                        leftIcon={X}
                        variant="outline"
                        size="sm"
                        loading={declining}
                        onClick={() => void decline(quotation.id)}
                      />
                    </div>
                  )}

                {!isProviderView && quotation.status === "PENDING" && !hasPrice && (
                  <Text variant="small" color="tertiary">
                    {t("quotes.card.awaitingProvider")}
                  </Text>
                )}

                {isProviderView && quotation.status === "PENDING" && (
                  <RespondForm
                    quotation={quotation}
                    onSubmit={(input) => void respond(input)}
                    loading={responding}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
