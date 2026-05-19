"use client";

import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
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
  visa: { front: ["#1a1f71", "#1565c0", "#1976d2"], back: ["#0d1245", "#0d3d7a", "#0f4a8c"] },
  mastercard: { front: ["#1a1a2e", "#16213e", "#0f3460"], back: ["#0d0d1a", "#0a1225", "#08203e"] },
  amex: { front: ["#006747", "#007a55", "#00a878"], back: ["#004a33", "#005a3d", "#006747"] },
  discover: { front: ["#7c3a00", "#b05400", "#d97706"], back: ["#4a2200", "#6b3300", "#8b4500"] },
  unknown: { front: ["#0c4a6e", "#0369a1", "#06b6d4"], back: ["#1e3a5f", "#0c4a6e", "#075985"] },
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
  const masked = padded.split("").map((ch, i) => (i < maxLen - 4 ? "•" : ch)).join("");
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
  return digits.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function NetworkBadge({ type }: { type: CardType }) {
  if (type === "visa") return <span style={{ fontFamily: fontFamily.sans, fontWeight: 700, fontSize: 22, color: "#fff", fontStyle: "italic", letterSpacing: 1 }}>VISA</span>;
  if (type === "mastercard") return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#eb001b", opacity: 0.9 }} />
      <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#f79e1b", opacity: 0.9, marginLeft: -10 }} />
    </div>
  );
  if (type === "amex") return (
    <div style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingInline: 8, paddingBlock: 4, borderRadius: 4 }}>
      <span style={{ fontFamily: fontFamily.sans, fontWeight: 700, fontSize: 12, color: "#fff", letterSpacing: 2 }}>AMEX</span>
    </div>
  );
  return null;
}

const inputStyle: React.CSSProperties = {
  height: 48,
  border: `1.5px solid ${colors.inputBorder}`,
  borderRadius: borderRadius.md,
  paddingInline: 14,
  fontFamily: fontFamily.sans,
  fontWeight: 500,
  fontSize: fontSize.base,
  color: colors.inputText,
  backgroundColor: colors.inputBg,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: fontSize.xs,
  fontFamily: fontFamily.sans,
  fontWeight: 600,
  color: colors.foregroundSecondary,
  marginBottom: 6,
  marginTop: 12,
  textTransform: "uppercase",
  letterSpacing: 0.6,
  display: "block",
};

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

  const cardBaseStyle: React.CSSProperties = {
    width: "100%",
    height: 200,
    borderRadius: borderRadius["2xl"],
    padding: 22,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    boxSizing: "border-box",
    backfaceVisibility: "hidden",
    transition: "transform 0.5s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Card preview */}
      <div style={{ height: 200, position: "relative", perspective: 1200 }}>
        {/* Front */}
        <div
          style={{
            ...cardBaseStyle,
            background: `linear-gradient(135deg, ${theme.front[0]}, ${theme.front[1]}, ${theme.front[2]})`,
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 1,
          }}
        >
          <div style={{ position: "absolute", width: 220, height: 220, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60 }} />
          <div style={{ position: "absolute", width: 160, height: 160, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.05)", bottom: -50, left: -30 }} />
          <div style={{ width: 42, height: 32, borderRadius: borderRadius.sm, backgroundColor: "#d4a843", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 28, height: 20, borderRadius: 4, border: "1px solid #b8922d" }} />
          </div>
          <span style={{ fontFamily: fontFamily.sans, fontWeight: 500, fontSize: fontSize.xl, letterSpacing: 3, color: colors.onPrimary, marginTop: 14 }}>
            {maskedNumber}
          </span>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 1.2, display: "block", marginBottom: 3 }}>CARD HOLDER</span>
              <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.onPrimary, letterSpacing: 0.5 }}>{displayHolder}</span>
            </div>
            <div>
              <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: 1.2, display: "block", marginBottom: 3 }}>EXPIRES</span>
              <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.onPrimary, letterSpacing: 0.5 }}>{displayExpiry}</span>
            </div>
            <NetworkBadge type={cardType} />
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            ...cardBaseStyle,
            background: `linear-gradient(135deg, ${theme.back[0]}, ${theme.back[1]}, ${theme.back[2]})`,
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
            zIndex: isFlipped ? 1 : 0,
          }}
        >
          <div style={{ position: "absolute", width: 220, height: 220, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60 }} />
          <div style={{ height: 44, backgroundColor: "#111", marginInline: -22, marginTop: 4 }} />
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16 }}>
            <div style={{ flex: 1, height: 36, backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingInline: 12 }}>
              <span style={{ fontFamily: fontFamily.sans, fontWeight: 700, fontSize: fontSize.base, color: colors.foreground, letterSpacing: 3 }}>
                {card.cvv ? "•".repeat(card.cvv.length) : "•••"}
              </span>
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: borderRadius.sm, paddingInline: 10, paddingBlock: 6 }}>
              <span style={{ fontFamily: fontFamily.sans, fontWeight: 700, fontSize: fontSize.xs, color: colors.onPrimary, letterSpacing: 1 }}>CVV</span>
            </div>
          </div>
          <p style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 400, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: "12px", margin: 0 }}>
            This card is issued subject to the conditions of the cardholder agreement.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={labelStyle}>Card Number</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          maxLength={numberMaxLen}
          value={card.number ? formatCardNumberInput(card.number.replace(/\D/g, ""), cardType) : ""}
          onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, "") }))}
          onFocus={() => setIsFlipped(false)}
          style={inputStyle}
        />

        <label style={labelStyle}>Cardholder Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={card.holder}
          onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value.toUpperCase() }))}
          onFocus={() => setIsFlipped(false)}
          style={inputStyle}
        />

        <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Expiry Date</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              maxLength={5}
              value={formatExpiry(card.expiry.replace(/\D/g, ""))}
              onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value.replace(/[^\d/]/g, "") }))}
              onFocus={() => setIsFlipped(false)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>CVV</label>
            <input
              type="password"
              inputMode="numeric"
              placeholder={isAmex ? "••••" : "•••"}
              maxLength={cvvMaxLen}
              value={card.cvv}
              onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "") }))}
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave?.(card)}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
            paddingBlock: 14,
            borderRadius: borderRadius.lg,
            backgroundColor: colors.primary,
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <Lock size={15} color={colors.onPrimary} strokeWidth={2.5} />
          <span style={{ fontFamily: fontFamily.sans, fontWeight: 700, fontSize: fontSize.base, color: colors.onPrimary }}>
            Save Card
          </span>
        </button>
      </div>
    </div>
  );
}
