"use client";

import { Lock } from "lucide-react";
import React, { useState } from "react";

export interface CardData {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

interface PaymentCardProps {
  initialData?: Partial<CardData>;
  onSave?: (data: CardData) => void;
}

type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function detectCardType(number: string): CardType {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(6011|65|64[4-9]|622)/.test(n)) return "discover";
  return "unknown";
}

type GradientTuple = [string, string, string];
const CARD_THEMES: Record<CardType, { front: GradientTuple; back: GradientTuple }> = {
  visa: {
    front: ["#1a1f71", "#1565c0", "#1976d2"],
    back: ["#0d1245", "#0d3d7a", "#0f4a8c"],
  },
  mastercard: {
    front: ["#1a1a2e", "#16213e", "#0f3460"],
    back: ["#0d0d1a", "#0a1225", "#08203e"],
  },
  amex: {
    front: ["#006747", "#007a55", "#00a878"],
    back: ["#004a33", "#005a3d", "#006747"],
  },
  discover: {
    front: ["#7c3a00", "#b05400", "#d97706"],
    back: ["#4a2200", "#6b3300", "#8b4500"],
  },
  unknown: {
    front: ["#0c4a6e", "#0369a1", "#06b6d4"],
    back: ["#1e3a5f", "#0c4a6e", "#075985"],
  },
};

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function buildMaskedDisplay(raw: string, type: CardType): string {
  const isAmex = type === "amex";
  const maxLen = isAmex ? 15 : 16;
  const digits = raw.replace(/\D/g, "").slice(0, maxLen);
  const padded = digits.padEnd(maxLen, "•");
  const masked = padded
    .split("")
    .map((ch, i) => (i < maxLen - 4 ? "•" : ch))
    .join("");
  if (isAmex) return `${masked.slice(0, 4)}  ${masked.slice(4, 10)}  ${masked.slice(10)}`;
  return masked.match(/.{1,4}/g)?.join("  ") ?? "••••  ••••  ••••  ••••";
}

function formatCardNumberInput(digits: string, type: CardType): string {
  if (type === "amex") {
    const d = digits.slice(0, 15);
    if (d.length <= 4) return d;
    if (d.length <= 10) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 10)} ${d.slice(10)}`;
  }
  return digits
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function NetworkBadge({ type }: { type: CardType }) {
  if (type === "visa")
    return (
      <span className="font-sans text-[22px] font-bold italic tracking-[1px] text-white">
        VISA
      </span>
    );
  if (type === "mastercard")
    return (
      <div className="flex flex-row items-center">
        <div className="size-7 rounded-full bg-[#eb001b]/90" />
        <div className="-ml-2.5 size-7 rounded-full bg-[#f79e1b]/90" />
      </div>
    );
  if (type === "amex")
    return (
      <div className="rounded-[4px] bg-white/20 px-2 py-1">
        <span className="font-sans text-xs font-bold tracking-[2px] text-white">
          AMEX
        </span>
      </div>
    );
  return null;
}

const INPUT_CLASS =
  "box-border h-12 w-full rounded-md border-[1.5px] border-solid border-input-border bg-input-bg px-3.5 font-sans text-base font-medium text-input-text outline-none";
const LABEL_CLASS =
  "mt-3 mb-1.5 block font-sans text-xs font-semibold uppercase tracking-[0.6px] text-foreground-secondary";
const CARD_FACE =
  "absolute top-0 left-0 box-border flex h-50 w-full flex-col justify-between overflow-hidden rounded-2xl p-5.5 [backface-visibility:hidden] transition-transform duration-500";

export default function PaymentCard({ initialData, onSave }: PaymentCardProps) {
  const [card, setCard] = useState<CardData>({
    number: initialData?.number ?? "",
    holder: initialData?.holder ?? "",
    expiry: initialData?.expiry ?? "",
    cvv: initialData?.cvv ?? "",
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const cardType = detectCardType(card.number);
  const theme = CARD_THEMES[cardType];
  const isAmex = cardType === "amex";
  const numberMaxLen = isAmex ? 17 : 19;
  const cvvMaxLen = isAmex ? 4 : 3;

  const maskedNumber = buildMaskedDisplay(card.number, cardType);
  const displayExpiry = card.expiry || "MM/YY";
  const displayHolder = card.holder || "FULL NAME";

  return (
    <div className="flex flex-col gap-6">
      {/* Card preview */}
      <div className="relative h-50 perspective-distant">
        {/* Front — gradient is theme-driven, transform/z-index depend on flip state */}
        <div
          className={CARD_FACE}
          style={{
            background: `linear-gradient(135deg, ${theme.front[0]}, ${theme.front[1]}, ${theme.front[2]})`,
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 1,
          }}
        >
          <div className="absolute -top-15 -right-15 size-55 rounded-full bg-white/5" />
          <div className="absolute -bottom-12.5 -left-7.5 size-40 rounded-full bg-white/5" />
          <div className="flex h-8 w-10.5 items-center justify-center rounded-sm bg-[#d4a843]">
            <div className="h-5 w-7 rounded-[4px] border border-[#b8922d]" />
          </div>
          <span className="mt-3.5 font-sans text-xl font-medium tracking-[3px] text-on-primary">
            {maskedNumber}
          </span>
          <div className="flex flex-row items-end justify-between">
            <div>
              <span className="mb-0.75 block font-sans text-xs font-semibold tracking-[1.2px] text-white/60">
                CARD HOLDER
              </span>
              <span className="font-sans text-sm font-semibold tracking-[0.5px] text-on-primary">
                {displayHolder}
              </span>
            </div>
            <div>
              <span className="mb-0.75 block font-sans text-xs font-semibold tracking-[1.2px] text-white/60">
                EXPIRES
              </span>
              <span className="font-sans text-sm font-semibold tracking-[0.5px] text-on-primary">
                {displayExpiry}
              </span>
            </div>
            <NetworkBadge type={cardType} />
          </div>
        </div>

        {/* Back */}
        <div
          className={CARD_FACE}
          style={{
            background: `linear-gradient(135deg, ${theme.back[0]}, ${theme.back[1]}, ${theme.back[2]})`,
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
            zIndex: isFlipped ? 1 : 0,
          }}
        >
          <div className="absolute -top-15 -right-15 size-55 rounded-full bg-white/5" />
          <div className="-mx-5.5 mt-1 h-11 bg-[#111]" />
          <div className="mt-4 flex flex-row items-center gap-2.5">
            <div className="flex h-9 flex-1 items-center justify-end rounded-[4px] bg-white/90 px-3">
              <span className="font-sans text-base font-bold tracking-[3px] text-foreground">
                {card.cvv ? "•".repeat(card.cvv.length) : "•••"}
              </span>
            </div>
            <div className="rounded-sm bg-white/15 px-2.5 py-1.5">
              <span className="font-sans text-xs font-bold tracking-[1px] text-on-primary">
                CVV
              </span>
            </div>
          </div>
          <p className="m-0 text-center font-sans text-xs font-normal leading-3 text-white/40">
            This card is issued subject to the conditions of the cardholder agreement.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>Card Number</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          maxLength={numberMaxLen}
          value={
            card.number
              ? formatCardNumberInput(card.number.replace(/\D/g, ""), cardType)
              : ""
          }
          onChange={(e) =>
            setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, "") }))
          }
          onFocus={() => setIsFlipped(false)}
          className={INPUT_CLASS}
        />

        <label className={LABEL_CLASS}>Cardholder Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={card.holder}
          onChange={(e) =>
            setCard((c) => ({ ...c, holder: e.target.value.toUpperCase() }))
          }
          onFocus={() => setIsFlipped(false)}
          className={INPUT_CLASS}
        />

        <div className="flex flex-row gap-3">
          <div className="flex-1">
            <label className={LABEL_CLASS}>Expiry Date</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              maxLength={5}
              value={formatExpiry(card.expiry.replace(/\D/g, ""))}
              onChange={(e) =>
                setCard((c) => ({ ...c, expiry: e.target.value.replace(/[^\d/]/g, "") }))
              }
              onFocus={() => setIsFlipped(false)}
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex-1">
            <label className={LABEL_CLASS}>CVV</label>
            <input
              type="password"
              inputMode="numeric"
              placeholder={isAmex ? "••••" : "•••"}
              maxLength={cvvMaxLen}
              value={card.cvv}
              onChange={(e) =>
                setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "") }))
              }
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave?.(card)}
          className="mt-5 flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-on-primary"
        >
          <Lock size={15} color="currentColor" strokeWidth={2.5} />
          <span className="font-sans text-base font-bold text-on-primary">Save Card</span>
        </button>
      </div>
    </div>
  );
}
