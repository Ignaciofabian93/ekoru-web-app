"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import {
  paymentCardAmexChipClass,
  paymentCardAmexTextClass,
  paymentCardBackRowClass,
  paymentCardChipClass,
  paymentCardChipInnerClass,
  paymentCardCvvChipClass,
  paymentCardCvvTextClass,
  paymentCardDecorBottomClass,
  paymentCardDecorTopClass,
  paymentCardFaceClass,
  paymentCardFieldClass,
  paymentCardFieldRowClass,
  paymentCardFinePrintClass,
  paymentCardFormClass,
  paymentCardInputClass,
  paymentCardLabelClass,
  paymentCardLockIconSize,
  paymentCardMastercardLeftClass,
  paymentCardMastercardRightClass,
  paymentCardMastercardRowClass,
  paymentCardMetaLabelClass,
  paymentCardMetaRowClass,
  paymentCardMetaValueClass,
  paymentCardNumberClass,
  paymentCardRootClass,
  paymentCardSignatureClass,
  paymentCardSignatureTextClass,
  paymentCardStageClass,
  paymentCardStripeClass,
  paymentCardSubmitClass,
  paymentCardSubmitTextClass,
  paymentCardTheme,
  paymentCardVisaClass,
} from "@/design/payment-card";

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

export type CardType = "visa" | "mastercard" | "amex" | "discover" | "unknown";

function detectCardType(number: string): CardType {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(6011|65|64[4-9]|622)/.test(n)) return "discover";
  return "unknown";
}

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
  if (type === "visa") return <span className={paymentCardVisaClass}>VISA</span>;
  if (type === "mastercard")
    return (
      <div className={paymentCardMastercardRowClass}>
        <div className={paymentCardMastercardLeftClass} />
        <div className={paymentCardMastercardRightClass} />
      </div>
    );
  if (type === "amex")
    return (
      <div className={paymentCardAmexChipClass}>
        <span className={paymentCardAmexTextClass}>AMEX</span>
      </div>
    );
  return null;
}

export default function PaymentCard({ initialData, onSave }: PaymentCardProps) {
  const [card, setCard] = useState<CardData>({
    number: initialData?.number ?? "",
    holder: initialData?.holder ?? "",
    expiry: initialData?.expiry ?? "",
    cvv: initialData?.cvv ?? "",
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const cardType = detectCardType(card.number);
  const theme = paymentCardTheme[cardType];
  const isAmex = cardType === "amex";
  const numberMaxLen = isAmex ? 17 : 19;
  const cvvMaxLen = isAmex ? 4 : 3;

  const maskedNumber = buildMaskedDisplay(card.number, cardType);
  const displayExpiry = card.expiry || "MM/YY";
  const displayHolder = card.holder || "FULL NAME";

  return (
    <div className={paymentCardRootClass}>
      {/* Card preview */}
      <div className={paymentCardStageClass}>
        {/* Front — gradient is theme-driven, transform/z-index depend on flip state */}
        <div
          className={paymentCardFaceClass}
          style={{
            background: `linear-gradient(135deg, ${theme.front[0]}, ${theme.front[1]}, ${theme.front[2]})`,
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 1,
          }}
        >
          <div className={paymentCardDecorTopClass} />
          <div className={paymentCardDecorBottomClass} />
          <div className={paymentCardChipClass}>
            <div className={paymentCardChipInnerClass} />
          </div>
          <span className={paymentCardNumberClass}>{maskedNumber}</span>
          <div className={paymentCardMetaRowClass}>
            <div>
              <span className={paymentCardMetaLabelClass}>CARD HOLDER</span>
              <span className={paymentCardMetaValueClass}>{displayHolder}</span>
            </div>
            <div>
              <span className={paymentCardMetaLabelClass}>EXPIRES</span>
              <span className={paymentCardMetaValueClass}>{displayExpiry}</span>
            </div>
            <NetworkBadge type={cardType} />
          </div>
        </div>

        {/* Back */}
        <div
          className={paymentCardFaceClass}
          style={{
            background: `linear-gradient(135deg, ${theme.back[0]}, ${theme.back[1]}, ${theme.back[2]})`,
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
            zIndex: isFlipped ? 1 : 0,
          }}
        >
          <div className={paymentCardDecorTopClass} />
          <div className={paymentCardStripeClass} />
          <div className={paymentCardBackRowClass}>
            <div className={paymentCardSignatureClass}>
              <span className={paymentCardSignatureTextClass}>
                {card.cvv ? "•".repeat(card.cvv.length) : "•••"}
              </span>
            </div>
            <div className={paymentCardCvvChipClass}>
              <span className={paymentCardCvvTextClass}>CVV</span>
            </div>
          </div>
          <p className={paymentCardFinePrintClass}>
            This card is issued subject to the conditions of the cardholder agreement.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className={paymentCardFormClass}>
        <label className={paymentCardLabelClass}>Card Number</label>
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
          className={paymentCardInputClass}
        />

        <label className={paymentCardLabelClass}>Cardholder Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={card.holder}
          onChange={(e) =>
            setCard((c) => ({ ...c, holder: e.target.value.toUpperCase() }))
          }
          onFocus={() => setIsFlipped(false)}
          className={paymentCardInputClass}
        />

        <div className={paymentCardFieldRowClass}>
          <div className={paymentCardFieldClass}>
            <label className={paymentCardLabelClass}>Expiry Date</label>
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
              className={paymentCardInputClass}
            />
          </div>
          <div className={paymentCardFieldClass}>
            <label className={paymentCardLabelClass}>CVV</label>
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
              className={paymentCardInputClass}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave?.(card)}
          className={paymentCardSubmitClass}
        >
          <Lock size={paymentCardLockIconSize} color="currentColor" strokeWidth={2.5} />
          <span className={paymentCardSubmitTextClass}>Save Card</span>
        </button>
      </div>
    </div>
  );
}
