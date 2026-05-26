# Checkout & Payments

This document covers the cart → checkout → payment → confirmation flow in
`ekoru-web-app`, and the work still needed across `ekoru-transactions` and
`ekoru-gateway` to wire real provider payments end-to-end.

Reading order: §1 explains what the web app does today, §2 audits the backend
as of 2026-05-26, §3 is the plan to close the gap.

---

## 1. Web app implementation

### 1.1 Feature layout (`features/cart/`)

Follows the feature-first rules in [`ARCHITECTURE.md`](./ARCHITECTURE.md):

```
features/cart/
  i18n/
    index.ts            # NAMESPACE = "cart" + getCartDictionary loader
    locales/{en,es,fr}.json
  screens/
    Cart.tsx            # /[lang]/cart
    Checkout.tsx        # /[lang]/cart/checkout
    Confirmation.tsx    # /[lang]/cart/confirmation
  ui/
    CartScreen.tsx, CartList.tsx, CartItemRow.tsx, EmptyCart.tsx
    CheckoutScreen.tsx, CheckoutStepper.tsx
    ShippingMethodPicker.tsx, ShippingAddressForm.tsx, MidPointNotice.tsx
    PaymentMethodPicker.tsx
    OrderSummary.tsx
    ConfirmationScreen.tsx, ConfirmationStatus.tsx
  hooks/
    useCart.ts          # selectors over the cart store
    useCheckout.ts      # orchestrates createOrder → createPayment → redirect
    usePaymentStatus.ts # polls payment status on the confirmation screen
    useShippingQuote.ts # local quote (free/flat) + carrier=UNAVAILABLE
  constants/
    shippingMethods.ts, paymentProviders.ts
```

### 1.2 Cart state

[`store/useCartStore.ts`](../store/useCartStore.ts) is a Zustand store with
`persist` to `localStorage` under the key `ekoru_cart`. Items carry
`{ productId, name, image, unitPrice, quantity, currency, sellerId, sellerName,
note? }`. Selectors: `useCartItems`, `useCartCount`, `useCartSubtotal`,
`useCartCurrency`, `useCartIsEmpty`.

Add-to-cart triggers live in:

- [`features/product/ui/ProductActions.tsx`](../features/product/ui/ProductActions.tsx) — the main product detail "Add to cart" / "Buy now" buttons.
- [`features/marketplace/ui/ProductGrid.tsx`](../features/marketplace/ui/ProductGrid.tsx) — the per-card "Add to cart" button.

Both default `currency` to `"CLP"` — `Product` doesn't carry a currency yet (see §3.6).

### 1.3 GraphQL contract (proposed)

The web app calls three operations under `graphql/checkout/`:

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id subtotal shippingCost taxAmount total currency
  }
}

mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    paymentId provider status
    redirect {
      __typename
      ... on WebpayRedirect { kind url token }
      ... on ExternalRedirect { kind url }
    }
    payment { id status amount currency orderId provider providerTransactionId paidAt }
  }
}

query GetPaymentStatus($paymentId: ID!) {
  payment(id: $paymentId) { id status amount currency orderId provider providerTransactionId paidAt }
}
```

Inputs are in [`types/checkout.ts`](../types/checkout.ts). Note that
`PaymentProviderId` is `"WEBPAY" | "KHIPU" | "MERCADOPAGO"` — wider than the
backend's `ChileanPaymentProvider` enum today (see §3.1).

### 1.4 Provider redirect flow

`useCheckout.pay()` runs:

1. `createOrder({ items, shippingMethod, shippingAddress?, currency })` — the
   server is the source of truth for totals; the client only sends ids and
   quantities. **The client never sends prices.**
2. `createPayment({ orderId, provider, returnUrl })`.
3. Hands off to the provider:
   - `WEBPAY_FORM` → builds a hidden `<form method="POST">` with `name="token_ws"` and submits it to `redirect.url`. This is the only correct way to integrate Transbank Webpay Plus; you cannot use a GET redirect.
   - `EXTERNAL` → `window.location.assign(redirect.url)`. Used by Khipu and MercadoPago.

`returnUrl` is the absolute URL `${origin}/${lang}/cart/confirmation`. Providers
that take return URLs from the request use this; providers that need them
pre-configured (Webpay) should use `${origin}/api/checkout/return/webpay`.

### 1.5 Return endpoint

[`app/api/checkout/return/[provider]/route.ts`](../app/api/checkout/return/[provider]/route.ts)
accepts GET (Khipu, MercadoPago) and POST (Webpay) and proxies the entire
request to `${GATEWAY_BASE_URL}/payments/return/:provider`. The gateway is the
only thing that talks to the provider SDK — the proxy just hands off and mirrors
the gateway's `Location` header (or builds a redirect to
`/[lang]/cart/confirmation?paymentId=…` from a JSON `{ paymentId }` response).

This route doesn't exist on the gateway yet — see §3.4.

### 1.6 Confirmation polling

`usePaymentStatus(paymentId)` queries `GET_PAYMENT_STATUS` with
`pollInterval: 3000` and stops once status reaches a terminal state
(`COMPLETED | FAILED | CANCELLED | REFUNDED | PARTIALLY_REFUNDED | EXPIRED`).
The confirmation screen reads `paymentId`, `payment_id`, or `token_ws` from the
URL so it doesn't matter which provider key the gateway echoes back.

---

## 2. Backend audit (2026-05-26)

### 2.1 `ekoru-transactions`

Nest + Apollo Federation subgraph, Postgres via Prisma, BullMQ workers backed
by Redis. Already has the right shape for an async payment processor.

**Prisma models** (`prisma/schema.prisma`):

- `Order { id, sellerId, shippingStatusId, version, createdAt, updatedAt }` — **no totals, no currency, no shipping address, no order-level status field.**
- `OrderItem { id, orderId, productId?, storeProductId?, quantity, price }` — `price: Int` is the price at order time. Supports both marketplace and store products.
- `ShippingStatus { id, status: ShippingStage, ... }` — only `PREPARING|SHIPPED|DELIVERED|RETURNED|CANCELED`. Not a payment status.
- `Payment { id, orderId?, quotationId?, amount, currency, status, paymentProvider, externalId?, externalToken?, fees?, netAmount?, payerId, receiverId, chileanConfigId, paymentType, ... }` — full model.
- `ChileanPaymentConfig { sellerId, provider, merchantId, apiKey, secretKey, environment, isActive, webhookUrl, returnUrl, cancelUrl }` — per-seller per-provider creds.
- `PaymentWebhook { paymentId?, provider, eventType, externalId, payload Json, processed, processingError, processedAt }`.
- `PaymentRefund`, `PaymentTransaction` — refund + audit trail.

**Enums** (`graphql/enums/`): `ChileanPaymentProvider = KHIPU | WEBPAY` — **MercadoPago is not in the enum yet.**

**GraphQL ops** ([`payments.resolver.ts`](../../ekoru-transactions/src/payments/payments.resolver.ts), [`orders.resolver.ts`](../../ekoru-transactions/src/orders/orders.resolver.ts)):

- `getPayment(id)`, `getPaymentsByPayer`, `getPaymentsByReceiver`, revenue analytics.
- `createPayment(input: CreatePaymentInput)` — but the input requires `amount`, `payerId`, `receiverId`, `paymentProvider`, `paymentType`, `chileanConfigId` directly from the client. **Anyone could pass any amount.**
- `getOrder(id)`, `getOrdersBySeller(sellerId)`.
- `createOrder(input: CreateOrderInput)` — input has `sellerId` + items with `price` per item. **Client-provided prices** — security issue.
- `refundPayment`, `createPaymentConfig`, `updateShipping`.

**Provider integration** ([`queues/processors/payment.processor.ts`](../../ekoru-transactions/src/queues/processors/payment.processor.ts)):

- BullMQ jobs: `initiate-payment`, `process-refund`, `process-webhook`. Structure is correct, but the bodies are **simulation stubs** — they don't call Khipu or Transbank, they return `khipu_sim_${paymentId}` / `webpay_sim_${paymentId}` and persist that as `externalId`. No `payment_url` is captured because no provider call is made.
- The `handleWebhook` service method on `PaymentsService` exists, but **no HTTP controller exposes it**. Only `health.controller.ts` exists in the subgraph.

### 2.2 `ekoru-gateway`

NestJS + Apollo Gateway federation. Routes HTTP-level auth concerns (cookies,
JWT, refresh) but leaves business logic to subgraphs.

- [`app.module.ts:130`](../../ekoru-gateway/src/app.module.ts#L130) — **the `transactions` subgraph is commented out.** Only `marketplace` is federated today. So even if `ekoru-transactions` is running, the gateway doesn't expose its schema.
- No REST controllers for payment returns or webhooks. Only `auth`, `images`, `health`.

---

## 3. Gap plan

In dependency order. Each step is bounded enough to land as its own PR.

### 3.1 Add `MERCADOPAGO` to the provider enum

**Where:** `ekoru-transactions/src/graphql/enums/index.ts` (registerEnumType
`ChileanPaymentProvider`) and `prisma/schema.prisma` enum block.

The web app already includes `MERCADOPAGO` in `PaymentProviderId` and the UI
shows the tile. Until the enum is widened on the backend, picking MercadoPago
will fail at validation time.

**Migration:** `ALTER TYPE "ChileanPaymentProvider" ADD VALUE 'MERCADOPAGO'`.
Name on the enum is misleading now — consider renaming the type to
`PaymentProvider` in a later cleanup, but that's not blocking.

### 3.2 Make `Order` carry totals + currency + address + payment status

`Order` today only carries `sellerId` and a `shippingStatusId`. The web app
expects `subtotal`, `shippingCost`, `taxAmount`, `total`, `currency`, and a
shipping address. It also needs an order-level status that's independent of
shipping (e.g. `PENDING_PAYMENT | PAID | CANCELED | REFUNDED`).

Minimum schema delta on `Order`:

```prisma
status            OrderStatus  @default(PENDING_PAYMENT)
subtotal          Int
shippingCost      Int          @default(0)
taxAmount         Int          @default(0)
total             Int
currency          String       @default("CLP")
shippingMethod    ShippingMethod
shippingAddressId Int?
buyerId           String                                   // = payerId on the Payment
```

Plus a new `ShippingAddress` model with `recipientName, phone, countryId,
regionId, cityId, countyId, street, reference?, zipCode?`. Counties/cities/etc.
are already exposed by another subgraph — keep just the IDs here and resolve
via federation if needed.

Plus a new enum `ShippingMethod = DELIVERED_TO_HOME | IN_HOUSE_PICKUP |
IN_MID_POINT_PICKUP | CARRIER` and `OrderStatus`.

### 3.3 Rewrite `createOrder` so the server owns totals

Current input takes `sellerId` and per-item `price` from the client. Replace
with the contract the web app uses:

```graphql
input CreateOrderInput {
  items: [OrderItemInput!]!         # { productId | storeProductId, quantity } only
  shippingMethod: ShippingMethod!
  shippingAddress: ShippingAddressInput   # required when shippingMethod requires one
  currency: String!                  # for now always "CLP"; reject if it doesn't match the products
}
```

Server-side `createOrder` must:

1. Resolve `buyerId` from `@CurrentSeller()`/JWT, never trust the client.
2. Fetch each product from the marketplace subgraph (REST `@requires` or an internal HTTP call) and read `price` and `sellerId` from the canonical record.
3. Validate that all items share the same `sellerId` (or accept multi-seller orders and split into one `Order` per seller — design decision; recommend single-seller v1 to keep payouts simple).
4. Compute `subtotal = Σ(price × quantity)`, `shippingCost` from method + address (flat-rate table for v1; carrier quote API later), `taxAmount = 0` for v1 (IVA already included in product prices for Chilean retail), `total = subtotal + shippingCost`.
5. Persist `Order` with `status = PENDING_PAYMENT`.
6. Return the totals so the client can show the same number it's about to be charged.

### 3.4 Rewrite `createPayment` to actually return a redirect

Current `createPayment` takes `amount`, `chileanConfigId`, `paymentType` from
the client and enqueues a BullMQ job that returns immediately with a `PENDING`
record. The client never sees the provider URL.

Two changes:

**A. Input — drop client-trusted fields:**

```graphql
input CreatePaymentInput {
  orderId: Int!
  provider: PaymentProvider!
  returnUrl: String!
}
```

Server reads `payerId` from `@CurrentSeller()`, `receiverId` and `amount` from
the `Order`, resolves `chileanConfigId` from the seller + provider.

**B. Synchronous provider call inside the mutation, not in BullMQ.**

The provider call has to be **synchronous** for the user-facing flow because
the response *is* the redirect URL. BullMQ is appropriate for retries on
*background* work (webhook reconciliation, refunds), not for the initiate-call
that the user is waiting on.

The mutation should:

1. Load the order, verify it's `PENDING_PAYMENT` and belongs to the caller.
2. Load the seller's `ChileanPaymentConfig` for the chosen provider.
3. Call the provider SDK directly. Catch network errors → return a typed GraphQL error so the client can show it inline.
4. Persist the resulting `externalId` and `externalToken` on the `Payment` row.
5. Return:

```graphql
type CreatePaymentResult {
  paymentId: ID!
  provider: PaymentProvider!
  status: PaymentStatus!
  redirect: PaymentRedirect!
  payment: Payment!
}

union PaymentRedirect = WebpayRedirect | ExternalRedirect
type WebpayRedirect  { kind: String!, url: String!, token: String! }
type ExternalRedirect { kind: String!, url: String! }
```

### 3.5 Add REST surface for provider returns + webhooks

These live on the gateway because the providers send the user's browser there
and webhooks come from public IPs that must hit a publicly addressable host.
The gateway re-emits cookies and proxies authenticated calls — same pattern.

**Routes to add** on `ekoru-gateway` (new `PaymentsController`):

- `POST /payments/return/webpay` — Transbank POSTs `token_ws` here. Confirms the transaction with `tx.commit(token)`, updates the `Payment` row via an internal call to the transactions subgraph, responds with `302 Location: /es/cart/confirmation?paymentId=…` (or a JSON `{ paymentId }`).
- `GET /payments/return/khipu` — Khipu redirects here with query params, typically `transaction_id`. Same shape.
- `GET /payments/return/mercadopago` — MercadoPago redirects with `collection_id`, `external_reference`. Same shape.
- `POST /payments/webhook/webpay` — Transbank's post-pay notification (separate from `return` — Webpay's return URL is also POST and that's where the commit happens; you may not need a separate webhook).
- `POST /payments/webhook/khipu` — Khipu's webhook (`x-khipu-signature` header). Verifies HMAC, then calls into transactions to update status.
- `POST /payments/webhook/mercadopago` — MercadoPago IPN/Webhook. Verifies signature, then forwards.

Each webhook handler MUST verify the provider's signature using the
`webhookSecret` in `ChileanPaymentConfig` before trusting any field.

The gateway can call into `ekoru-transactions` either through an internal
GraphQL mutation (`processProviderWebhook(provider, paymentId, payload)`) or
through a separate internal REST. GraphQL is the lower-friction option since
the federation client already exists.

### 3.6 Federate the transactions subgraph

Uncomment in `ekoru-gateway/src/app.module.ts:130`:

```ts
{ name: 'transactions', url: getServiceUrl('TRANSACTIONS') },
```

…and add `EKORU_TRANSACTIONS_{DEV,STAGING,PROD}_URL` to the gateway's env. The
subgraph already declares federation directives (Order/Payment as types).

Until this is done, the web app's `CREATE_ORDER`/`CREATE_PAYMENT`/`GET_PAYMENT_STATUS`
queries will fail with "Cannot query field createOrder" at the gateway.

### 3.7 Real provider SDK integrations

Where the simulation stubs live today:
[`payment.processor.ts:97-166`](../../ekoru-transactions/src/queues/processors/payment.processor.ts#L97-L166).
After §3.4 the initiate call moves into the resolver, but the SDK code is the
same shape.

**Webpay Plus (Transbank)** — npm `transbank-sdk`:

```ts
import { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } from 'transbank-sdk';

const env = config.environment === 'PRODUCTION' ? Environment.Production : Environment.Integration;
const tx = new WebpayPlus.Transaction(new Options(config.merchantId!, config.secretKey!, env));
const { token, url } = await tx.create(
  buyOrder,          // unique string, max 26 chars — use `ekoru-${order.id}-${Date.now()}`
  sessionId,         // unique per session
  amount,            // CLP integer
  returnUrl,         // ${GATEWAY_BASE_URL}/payments/return/webpay
);
// Return WebpayRedirect { kind: "WEBPAY_FORM", url, token } to the client.
```

The return handler then commits:

```ts
const response = await tx.commit(token); // throws on rejection
// response.status === 'AUTHORIZED' → mark Payment COMPLETED
```

Use **integration** credentials in dev/staging:
`IntegrationCommerceCodes.WEBPAY_PLUS` (597055555532) and the matching API key.

**Khipu** — npm `khipu` or a thin axios wrapper over their REST API:

```ts
const resp = await axios.post('https://payment-api.khipu.com/v3/payments', {
  amount,
  currency: 'CLP',
  subject: description,
  return_url: `${GATEWAY_BASE_URL}/payments/return/khipu`,
  cancel_url: `${returnUrl}?status=cancelled`,
  notify_url: `${GATEWAY_BASE_URL}/payments/webhook/khipu`,
  transaction_id: `ekoru-${order.id}`,
}, {
  headers: { 'x-api-key': config.apiKey! },
});
// resp.data: { payment_id, payment_url, simplified_transfer_url, transfer_url, ... }
// Return ExternalRedirect { kind: "EXTERNAL", url: payment_url }
```

**MercadoPago** — npm `mercadopago` (Checkout Pro):

```ts
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: config.secretKey! });
const pref = await new Preference(client).create({
  body: {
    items: order.orderItem.map(i => ({ id: String(i.productId), title: '...', unit_price: i.price, quantity: i.quantity, currency_id: 'CLP' })),
    back_urls: {
      success: `${GATEWAY_BASE_URL}/payments/return/mercadopago`,
      failure: `${GATEWAY_BASE_URL}/payments/return/mercadopago?status=failed`,
      pending: `${GATEWAY_BASE_URL}/payments/return/mercadopago?status=pending`,
    },
    notification_url: `${GATEWAY_BASE_URL}/payments/webhook/mercadopago`,
    external_reference: `ekoru-${order.id}`,
    auto_return: 'approved',
  },
});
// pref.init_point is the redirect URL.
// Return ExternalRedirect { kind: "EXTERNAL", url: pref.init_point }
```

### 3.8 Multi-currency / `Product.currency`

`Product` and `StoreProduct` carry `price: number` with no currency. Web app
defaults to `CLP` at add-to-cart. That's fine for a Chile-first launch but the
gateway should reject orders whose products span multiple currencies, and
eventually `Product` needs a `currency: String!` field (or a sellerCurrency on
the seller record). Not blocking v1.

### 3.9 Shipping quotes

Web `useShippingQuote` flat-rates `DELIVERED_TO_HOME` at CLP $3,990 and marks
`CARRIER` as `UNAVAILABLE`. Real options:

- v1: store a `shippingFee` on `BusinessProfile` or as a per-region table and resolve server-side in `createOrder`.
- v2: integrate Chilexpress / Starken quote APIs; add a `shippingQuote(method, address, items)` query the web calls before showing the summary.

### 3.10 Order-level status & buyer history

`getOrdersBySeller` exists but no `getOrdersByBuyer(payerId)`. Confirmation
screen success state links to `/[lang]/profile/orders` (already a page) — that
page will need this query when wired.

---

## 4. Rollout sequence (PR-sized chunks)

In order — earlier PRs unblock later ones.

| # | Repo | Change | Unblocks |
|---|------|--------|----------|
| 1 | `transactions` | Prisma migration: `OrderStatus`, `ShippingMethod`, `ShippingAddress`, totals on `Order` | 2, 3, 8 |
| 2 | `transactions` | Rewrite `createOrder` (server-owned totals, auth from JWT) | 3 |
| 3 | `transactions` | Rewrite `createPayment` to return `PaymentRedirect` union; move initiate into the resolver | 7 |
| 4 | `transactions` | Add `MERCADOPAGO` to enum + migration | 7 |
| 5 | `transactions` | Implement Webpay SDK call (sandbox creds in env) | 7 |
| 6 | `transactions` | Implement Khipu + MercadoPago SDK calls | 7 |
| 7 | `gateway` | Uncomment `transactions` subgraph; add `EKORU_TRANSACTIONS_*_URL` env | 8, web app smoke test |
| 8 | `gateway` | Add `PaymentsController` with `return/:provider` + `webhook/:provider` routes | end-to-end checkout |
| 9 | `transactions` | Wire webhook → BullMQ → `processWebhook` job → `Payment.status` updates | order completion |
| 10 | `web-app` | Replace `CARRIER unavailable` branch with a real `shippingQuote` query | carrier method |

Pause and test at the end of each chunk — Webpay's sandbox is fast to verify
once #1-#5 land.

---

## 5. Open questions for the next decision pass

These shape the schema choices in §3.2-§3.3. Worth deciding before #1 lands.

- **Multi-seller carts.** Today's cart can hold items from different sellers. Does the backend split into one `Order` per seller (clean payouts, multiple payments, worse UX) or reject mixed-seller carts at `createOrder` (simple v1, ugly error)? Recommendation: reject for v1, show the user a "split your order" affordance in the cart later.
- **Where commission/fees live.** `Payment.fees` and `netAmount` columns exist. Who computes them — the resolver, or a separate `splitPayment` step after `COMPLETED`? Affects whether the seller's `ChileanPaymentConfig` is the *only* payee or whether Ekoru's account is.
- **Sandbox seller config.** Right now `ChileanPaymentConfig` is per-seller. For sandbox/testing, do you want a "platform" config fallback so dev users without their own merchant creds can still complete checkout? Recommendation: yes — add an `isPlatformDefault: Boolean` flag and pick that when the seller has no active config.
- **Refund UX.** `refundPayment` exists but no frontend surface. Out of scope for the checkout PR but worth knowing whether the buyer or the seller initiates it.
- **MercadoPago in Chile.** They have lower bank-transfer penetration than Khipu but accept international cards Webpay doesn't. Worth confirming with whoever owns the commercial side that it's worth the integration effort for v1 — it's the most work for the smallest local share.
