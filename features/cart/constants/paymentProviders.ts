import type { Currency } from "@/constants/settings";
import type { PaymentProviderId } from "@/types/checkout";

export type PaymentProviderMeta = {
  id: PaymentProviderId;
  /** Currencies the provider accepts. The UI hides providers that don't match the cart currency. */
  currencies: Currency[];
  /**
   * Webpay returns a redirect that the browser must submit as a form-POST (token + url).
   * Khipu and MercadoPago return a plain URL the browser can navigate to with GET.
   */
  redirectKind: "WEBPAY_FORM" | "EXTERNAL";
  /**
   * Offered to buyers. Mercado Pago only since 2026-10-19: stores are paid
   * through its marketplace split (D1). Webpay stays built as a future option;
   * turning it back on also needs it in the transactions `PAYMENT_PROVIDERS`.
   */
  enabled: boolean;
};

export const PAYMENT_PROVIDERS: PaymentProviderMeta[] = [
  { id: "MERCADOPAGO", currencies: ["CLP"], redirectKind: "EXTERNAL", enabled: true },
  { id: "WEBPAY", currencies: ["CLP"], redirectKind: "WEBPAY_FORM", enabled: false },
  { id: "KHIPU", currencies: ["CLP"], redirectKind: "EXTERNAL", enabled: false },
];

/** What memberships and quote payments use: the first provider switched on. */
export const DEFAULT_PAYMENT_PROVIDER: PaymentProviderId =
  PAYMENT_PROVIDERS.find((p) => p.enabled)?.id ?? "MERCADOPAGO";

export const availableProvidersFor = (currency: Currency): PaymentProviderMeta[] =>
  PAYMENT_PROVIDERS.filter((p) => p.enabled && p.currencies.includes(currency));

/**
 * Where the provider sends the buyer back: the Next proxy route, which hands
 * the return to the gateway. The path names the provider, so it must match the
 * one the payment was started with.
 */
export const paymentReturnUrl = (provider: PaymentProviderId): string =>
  `${typeof window === "undefined" ? "" : window.location.origin}/api/checkout/return/${provider.toLowerCase()}`;
