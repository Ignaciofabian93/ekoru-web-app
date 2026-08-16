/**
 *
 * Usage:  className={paymentCardFaceClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { CardType } from "@/components/Patterns/PaymentCard/PaymentCard";

/**
 * Card face gradients, per detected network. Applied as an inline
 * `linear-gradient` rather than utilities — the three stops are network brand
 * colors, not palette tokens, and none of them recur elsewhere.
 */
export type GradientTuple = [string, string, string];

export const paymentCardTheme: Record<
  CardType,
  { front: GradientTuple; back: GradientTuple }
> = {
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

export const paymentCardRootClass = "flex flex-col gap-6";

export const paymentCardStageClass = "relative h-50 perspective-distant";

export const paymentCardFaceClass = clsx(
  "absolute top-0 left-0 box-border flex h-50 w-full flex-col justify-between",
  "overflow-hidden rounded-2xl p-5.5",
  "[backface-visibility:hidden] transition-transform duration-500",
);

export const paymentCardDecorTopClass =
  "absolute -top-15 -right-15 size-55 rounded-full bg-white/5";

export const paymentCardDecorBottomClass =
  "absolute -bottom-12.5 -left-7.5 size-40 rounded-full bg-white/5";

export const paymentCardChipClass =
  "flex h-8 w-10.5 items-center justify-center rounded-sm bg-[#d4a843]";

export const paymentCardChipInnerClass = "h-5 w-7 rounded-[4px] border border-[#b8922d]";

export const paymentCardNumberClass =
  "mt-3.5 font-sans text-xl font-medium tracking-[3px] text-on-primary";

export const paymentCardMetaRowClass = "flex flex-row items-end justify-between";

export const paymentCardMetaLabelClass =
  "mb-0.75 block font-sans text-xs font-semibold tracking-[1.2px] text-white/60";

export const paymentCardMetaValueClass =
  "font-sans text-sm font-semibold tracking-[0.5px] text-on-primary";

export const paymentCardStripeClass = "-mx-5.5 mt-1 h-11 bg-[#111]";

export const paymentCardBackRowClass = "mt-4 flex flex-row items-center gap-2.5";

export const paymentCardSignatureClass =
  "flex h-9 flex-1 items-center justify-end rounded-[4px] bg-white/90 px-3";

export const paymentCardSignatureTextClass =
  "font-sans text-base font-bold tracking-[3px] text-foreground";

export const paymentCardCvvChipClass = "rounded-sm bg-white/15 px-2.5 py-1.5";

export const paymentCardCvvTextClass =
  "font-sans text-xs font-bold tracking-[1px] text-on-primary";

export const paymentCardFinePrintClass =
  "m-0 text-center font-sans text-xs font-normal leading-3 text-white/40";

export const paymentCardFormClass = "flex flex-col gap-1";

export const paymentCardInputClass = clsx(
  "box-border h-12 w-full rounded-md px-3.5",
  "border-[1.5px] border-solid border-input-border bg-input-bg",
  "font-sans text-base font-medium text-input-text outline-none",
);

export const paymentCardLabelClass = clsx(
  "mt-3 mb-1.5 block",
  "font-sans text-xs font-semibold uppercase tracking-[0.6px] text-foreground-secondary",
);

export const paymentCardFieldRowClass = "flex flex-row gap-3";

export const paymentCardFieldClass = "flex-1";

export const paymentCardSubmitClass = clsx(
  "mt-5 flex w-full cursor-pointer flex-row items-center justify-center gap-2",
  "rounded-lg bg-primary py-3.5 text-on-primary",
);

export const paymentCardSubmitTextClass = "font-sans text-base font-bold text-on-primary";

// ─── Network badges ───────────────────────────────────────────────
export const paymentCardVisaClass =
  "font-sans text-[22px] font-bold italic tracking-[1px] text-white";

export const paymentCardMastercardRowClass = "flex flex-row items-center";

export const paymentCardMastercardLeftClass = "size-7 rounded-full bg-[#eb001b]/90";

export const paymentCardMastercardRightClass =
  "-ml-2.5 size-7 rounded-full bg-[#f79e1b]/90";

export const paymentCardAmexChipClass = "rounded-[4px] bg-white/20 px-2 py-1";

export const paymentCardAmexTextClass =
  "font-sans text-xs font-bold tracking-[2px] text-white";

export const paymentCardLockIconSize = 15;
