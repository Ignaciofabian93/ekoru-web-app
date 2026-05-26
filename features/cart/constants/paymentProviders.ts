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
};

export const PAYMENT_PROVIDERS: PaymentProviderMeta[] = [
  { id: "WEBPAY", currencies: ["CLP"], redirectKind: "WEBPAY_FORM" },
  { id: "KHIPU", currencies: ["CLP"], redirectKind: "EXTERNAL" },
  { id: "MERCADOPAGO", currencies: ["CLP", "ARS", "BRL", "MXN", "USD"], redirectKind: "EXTERNAL" },
];

export const availableProvidersFor = (currency: Currency): PaymentProviderMeta[] =>
  PAYMENT_PROVIDERS.filter((p) => p.currencies.includes(currency));
