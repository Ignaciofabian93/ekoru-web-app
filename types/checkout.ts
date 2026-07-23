import type { Currency } from "@/constants/settings";
import type { PaymentStatus } from "./enums";
import type { Payment } from "./transaction";

export type ShippingMethod =
  | "DELIVERED_TO_HOME"
  | "IN_HOUSE_PICKUP"
  | "IN_MID_POINT_PICKUP"
  | "CARRIER";

/**
 * Payment providers the checkout UI surfaces. Wider than the existing
 * `ChileanPaymentProvider` in `types/enums.ts` so we can offer MercadoPago
 * alongside Webpay/Khipu. The gateway should accept the same string values.
 */
export type PaymentProviderId = "WEBPAY" | "KHIPU" | "MERCADOPAGO";

export type ShippingAddressInput = {
  recipientName: string;
  countryId: number;
  regionId: number;
  cityId: number;
  countyId: number;
  street: string;
  reference?: string;
  zipCode?: string;
  phone: string;
};

export type CheckoutItemInput = {
  /** Set for marketplace (peer-to-peer) products. Mutually exclusive with storeProductId. */
  productId?: number;
  /** Set for store (business catalog) products. Mutually exclusive with productId. */
  storeProductId?: number;
  quantity: number;
};

export type CreateOrderInput = {
  items: CheckoutItemInput[];
  shippingMethod: ShippingMethod;
  shippingAddress?: ShippingAddressInput;
  currency: Currency;
};

export type CreateOrderResponse = {
  id: number;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  currency: Currency;
};

export type CreatePaymentInput = {
  orderId: number;
  provider: PaymentProviderId;
  /** Absolute URL where the provider redirects after the user completes/cancels. */
  returnUrl: string;
};

export type WebpayRedirect = {
  kind: "WEBPAY_FORM";
  url: string;
  token: string;
};

export type ExternalRedirect = {
  kind: "EXTERNAL";
  url: string;
};

export type CreatePaymentResponse = {
  paymentId: string;
  provider: PaymentProviderId;
  status: PaymentStatus;
  redirect: WebpayRedirect | ExternalRedirect;
};

export type PaymentStatusResponse = Pick<
  Payment,
  | "id"
  | "status"
  | "amount"
  | "currency"
  | "orderId"
  | "provider"
  | "providerTransactionId"
  | "paidAt"
>;
