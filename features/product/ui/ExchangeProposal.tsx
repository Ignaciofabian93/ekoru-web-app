"use client";
import clsx from "clsx";
import { Check, Repeat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { Modal } from "@/components/Overlays/Modal";
import type { SupportedLanguage } from "@/constants/settings";
import { useDealSettings } from "@/features/deals/hooks/useDealSettings";
import { useMyListings } from "@/features/profile/hooks/useMyListings";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";
import type { Product } from "@/types/product";
import { resolveImageUrl } from "@/utils/resolveImage";

import { useProposeExchange } from "../hooks/useProposeExchange";
import { NAMESPACE } from "../i18n";

interface Props {
  product: Product;
  lang: SupportedLanguage;
  /**
   * Closes the dialog. The caller mounts this component only while the
   * proposal is open, so closing unmounts it — which is what leaves the form,
   * the selection and the sent-confirmation clean for the next time.
   */
  onClose: () => void;
}

/** Matches the cap the transactions subgraph applies before storing the note. */
const MAX_NOTES_LENGTH = 500;

function Thumb({ name, image }: { name: string; image?: string }) {
  const src = resolveImageUrl(image);
  return (
    <div className="bg-background-secondary relative size-14 shrink-0 overflow-hidden rounded-lg">
      {src && <Image src={src} alt={name} fill sizes="56px" className="object-cover" />}
    </div>
  );
}

/** A dead end rather than the form — nothing to fill in, so just say why. */
function Notice({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 py-2 text-center">{children}</div>;
}

/**
 * The exchange proposal, in a dialog over the listing.
 *
 * It used to take the buy panel's place in the rail, which pushed the rest of
 * the page down and left no way back to the price without a reload. As a modal
 * it opens over the listing, and Cancel returns to it untouched.
 */
export function ExchangeProposal({ product, lang, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const seller = useSeller();
  const isOwn = useIsOwnProduct(product.sellerId);
  const { products, loading: loadingMine } = useMyListings({
    status: "active",
    enabled: Boolean(seller),
  });
  const { propose, loading, done } = useProposeExchange();
  const settings = useDealSettings();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Can't offer the very product being requested; everything else the user owns
  // is fair game to put on the table.
  const offerable = useMemo(
    () => products.filter((p) => String(p.id) !== String(product.id)),
    [products, product.id],
  );
  const selected = offerable.find((p) => String(p.id) === selectedId) ?? null;

  const theirValue = product.price;
  const yourValue = selected?.price ?? 0;
  // Positive → the requested item is worth more, so the proposer tops up.
  const diff = theirValue - yourValue;
  // The server only records a cash compensation once the gap reaches the
  // threshold; below it the trade is settled as even, so say so rather than
  // promising a top-up the deal will never carry.
  const owesCash = Math.abs(diff) >= settings.compensationThresholdClp;

  const balanceLabel = !owesCash
    ? diff === 0
      ? t("exchange.even")
      : t("exchange.noCompensation", {
          threshold: formatPrice(settings.compensationThresholdClp),
        })
    : diff > 0
      ? t("exchange.youAdd", { amount: formatPrice(Math.abs(diff)) })
      : t("exchange.theyAdd", { amount: formatPrice(Math.abs(diff)) });

  function renderBody() {
    if (!seller) {
      return (
        <Notice>
          <Text weight="semibold">{t("exchange.loginRequired")}</Text>
          <Link
            href={`/${lang}/login`}
            className="text-primary font-semibold hover:underline"
          >
            {t("exchange.loginCta")}
          </Link>
        </Notice>
      );
    }

    if (isOwn) {
      return (
        <Notice>
          <Text weight="semibold">{t("exchange.ownProduct")}</Text>
        </Notice>
      );
    }

    if (done) {
      return (
        <Notice>
          <div className="bg-success/10 text-success mx-auto flex size-12 items-center justify-center rounded-full">
            <Check size={24} strokeWidth={2.5} />
          </div>
          <Title level="h2" size="h5" weight="semibold" align="center">
            {t("exchange.sent")}
          </Title>
          <Text size="sm" color="secondary" align="center">
            {t("exchange.sentHint")}
          </Text>
          {/* The proposal is gone — there is nothing left to do here but leave. */}
          <div className="mt-1 flex justify-center">
            <Button
              variant="primary"
              size="md"
              text={t("exchange.done")}
              onPress={onClose}
            />
          </div>
        </Notice>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {/* You receive */}
        <div className="flex flex-col gap-1.5">
          <Text size="sm" weight="semibold" color="secondary">
            {t("exchange.receive")}
          </Text>
          <div className="border-border-light flex items-center gap-3 rounded-xl border p-3">
            <Thumb name={product.name} image={product.images?.[0]} />
            <div className="min-w-0 flex-1">
              <Text weight="semibold" numberOfLines={1}>
                {product.name}
              </Text>
              <Text weight="bold" color="primary">
                {formatPrice(theirValue)}
              </Text>
            </div>
          </div>
        </div>

        {/* Your offer */}
        <div className="flex flex-col gap-1.5">
          <Text size="sm" weight="semibold" color="secondary">
            {t("exchange.yourOffer")}
          </Text>
          {loadingMine ? (
            <div className="flex flex-col gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-background-secondary h-18.5 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : offerable.length === 0 ? (
            <Text size="sm" color="tertiary">
              {t("exchange.noProducts")}
            </Text>
          ) : (
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {offerable.map((p) => {
                const active = String(p.id) === selectedId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(String(p.id))}
                    aria-pressed={active}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border-light hover:border-primary/40",
                    )}
                  >
                    <Thumb name={p.name} image={p.images?.[0]} />
                    <div className="min-w-0 flex-1">
                      <Text weight="semibold" numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text weight="bold" color="primary">
                        {formatPrice(p.price)}
                      </Text>
                    </div>
                    {active && (
                      <Check
                        size={18}
                        strokeWidth={2.5}
                        className="text-primary shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Value comparison */}
        {selected && (
          <div className="bg-background-secondary flex flex-col gap-1 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <Text size="sm" color="secondary">
                {t("exchange.theirValue")}
              </Text>
              <Text size="sm" weight="semibold">
                {formatPrice(theirValue)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="sm" color="secondary">
                {t("exchange.yourValue")}
              </Text>
              <Text size="sm" weight="semibold">
                {formatPrice(yourValue)}
              </Text>
            </div>
            <div className="border-border-light mt-1 border-t pt-2">
              <Text
                size="sm"
                weight="semibold"
                color={diff === 0 ? "success" : "default"}
              >
                {balanceLabel}
              </Text>
            </div>
          </div>
        )}

        {/* Message — travels with the proposal into the owner's notification. */}
        <div className="flex flex-col gap-1.5">
          <Text size="sm" weight="semibold" color="secondary">
            {t("exchange.notesLabel")}
          </Text>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={MAX_NOTES_LENGTH}
            placeholder={t("exchange.notesPlaceholder")}
            className="border-input-border bg-input-bg text-input-text focus:border-input-border-focus w-full resize-none rounded-xl border p-3 text-sm outline-none"
          />
          <Text size="xs" color="tertiary">
            {t("exchange.notesHint")}
          </Text>
        </div>

        <Text size="xs" color="tertiary">
          {t("exchange.pointsHint", { points: String(settings.completionPoints) })}
        </Text>

        {/* Cancel first: it's the way out of a dialog that took over the page,
            and it must stay reachable even while the proposal is in flight. */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="md"
            fullWidth
            text={t("exchange.cancel")}
            onPress={onClose}
          />
          <Button
            variant="primary"
            size="md"
            fullWidth
            leftIcon={Repeat}
            disabled={!selected}
            loading={loading}
            loadingText={t("exchange.sending")}
            text={t("exchange.send")}
            onPress={() =>
              selected &&
              propose({
                requestedProductId: String(product.id),
                offeredProductId: String(selected.id),
                notes: notes.trim() || undefined,
              })
            }
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t("exchange.title")}
      closeLabel={t("exchange.close")}
      size="md"
    >
      {renderBody()}
    </Modal>
  );
}
