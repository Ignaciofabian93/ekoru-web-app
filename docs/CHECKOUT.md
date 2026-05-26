# Checkout & Payments

This doc covers the cart → checkout → payment → confirmation flow across
`ekoru-web-app`, `ekoru-transactions`, and `ekoru-gateway`.

Reading order: §1 explains the web-app side, §2 the transactions subgraph,
§3 the gateway, §4 lists what still needs running locally before the flow
is end-to-end live, §5 holds open product questions.

---

## 1. Web app (`ekoru-web-app`)

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
    useCart.ts, useCheckout.ts, usePaymentStatus.ts, useShippingQuote.ts
  constants/
    shippingMethods.ts, paymentProviders.ts
```

### 1.2 Cart state

[`store/useCartStore.ts`](../store/useCartStore.ts) — Zustand + `persist` to
`localStorage` under `ekoru_cart`. Selectors: `useCartItems`, `useCartCount`,
`useCartSubtotal`, `useCartCurrency`, `useCartIsEmpty`.

Add-to-cart wired in:

- [`features/product/ui/ProductActions.tsx`](../features/product/ui/ProductActions.tsx) — main product page Add to cart / Buy now.
- [`features/marketplace/ui/ProductGrid.tsx`](../features/marketplace/ui/ProductGrid.tsx) — grid card.

### 1.3 GraphQL contract

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
  payment(id: $paymentId) { ... }
}
```

Inputs in [`types/checkout.ts`](../types/checkout.ts). The matching backend
implementation lives in §2 below.

### 1.4 Redirect flow

`useCheckout.pay()`:

1. `createOrder({ items, shippingMethod, shippingAddress?, currency })` — server owns totals.
2. `createPayment({ orderId, provider, returnUrl })`.
3. Provider hand-off:
   - `WEBPAY_FORM` → hidden `<form method="POST">` with `name="token_ws"` submitted to `redirect.url`. (Webpay does **not** accept GET.)
   - `EXTERNAL` → `window.location.assign(redirect.url)` for Khipu and MercadoPago.
4. Confirmation screen polls `payment(id)` every 3s until status is terminal.

The `returnUrl` is `${origin}/api/checkout/return/<provider>` — the Next.js
proxy at [`app/api/checkout/return/[provider]/route.ts`](../app/api/checkout/return/[provider]/route.ts)
forwards to the gateway and mirrors its `Location` redirect.

---

## 2. Transactions subgraph (`ekoru-transactions`)

### 2.1 Prisma schema changes

Master schema: [`prisma/schema.prisma`](../../prisma/schema.prisma) (the
per-subgraph copy at `ekoru-transactions/prisma/schema.prisma` is also
updated so `prisma generate` in the subgraph picks up the new client).

- New enums: `OrderStatus` (`PENDING_PAYMENT | PAID | CANCELED | REFUNDED`), `ShippingMethod` (`DELIVERED_TO_HOME | IN_HOUSE_PICKUP | IN_MID_POINT_PICKUP | CARRIER`).
- `ChileanPaymentProvider` adds `MERCADOPAGO`.
- New model `ShippingAddress` (`recipientName, phone, countryId, regionId, cityId, countyId, street, reference?, zipCode?`). FK relations to `Country/Region/City/County` exist in the master and are stripped from the transactions subgraph as usual (cross-subgraph relations are FKs only).
- `Order` extended with: `buyerId`, `status`, `subtotal`, `shippingCost`, `taxAmount`, `total`, `currency`, `shippingMethod`, `shippingAddressId`. The `seller` Prisma relation is renamed to `seller_Order_sellerIdToSeller` because Order now has two relations to Seller (buyer + seller) and Prisma requires explicit relation names. **No SQL change** for the rename — Prisma relation names live in the client metadata, not Postgres.
- Migration at [`prisma/migrations/20260526120000_checkout_orders_addresses/migration.sql`](../../prisma/migrations/20260526120000_checkout_orders_addresses/migration.sql). The migration backfills `buyerId = sellerId` and `status = PAID` for historical rows so the NOT NULL constraints apply.

### 2.2 GraphQL types

- [`src/graphql/enums/index.ts`](../../ekoru-transactions/src/graphql/enums/index.ts) registers the new enums.
- [`src/orders/entities/order.entity.ts`](../../ekoru-transactions/src/orders/entities/order.entity.ts) — extended with totals, status, shipping fields, and `@Field(() => Seller) buyer`.
- [`src/orders/entities/shipping-address.entity.ts`](../../ekoru-transactions/src/orders/entities/shipping-address.entity.ts) — new entity.
- [`src/payments/entities/payment-redirect.entity.ts`](../../ekoru-transactions/src/payments/entities/payment-redirect.entity.ts) — `WebpayRedirect | ExternalRedirect` union.
- [`src/payments/entities/create-payment-result.entity.ts`](../../ekoru-transactions/src/payments/entities/create-payment-result.entity.ts) — the `createPayment` return shape.

### 2.3 `createOrder` — server-owned totals

[`src/orders/orders.service.ts`](../../ekoru-transactions/src/orders/orders.service.ts):

1. `buyerId` is taken from `@CurrentSeller()`. Never from input.
2. [`MarketplaceClient`](../../ekoru-transactions/src/common/clients/marketplace.client.ts) looks up canonical product prices via a GraphQL query to the marketplace subgraph — see §4.4 for the resolver the marketplace needs to expose.
3. Multi-seller carts are rejected with a clear error (single-seller v1 — see §5).
4. Shipping cost from a flat-rate table (`DELIVERED_TO_HOME = 3990 CLP`, pickups free, carrier rejected until §4.5).
5. Order is persisted atomically with `OrderItem`s, `ShippingStatus`, and (when applicable) `ShippingAddress`. Status starts at `PENDING_PAYMENT`.

DTO at [`src/orders/dto/create-order.input.ts`](../../ekoru-transactions/src/orders/dto/create-order.input.ts). Resolver at [`src/orders/orders.resolver.ts`](../../ekoru-transactions/src/orders/orders.resolver.ts) — also exposes a new `getOrdersByBuyer` query the web app's confirmation page links to.

### 2.4 `createPayment` — synchronous redirect

[`src/payments/payments.service.ts`](../../ekoru-transactions/src/payments/payments.service.ts) `createPayment`:

1. Loads the Order, checks `buyerId === payerId` (from JWT) and `status === PENDING_PAYMENT`.
2. Resolves the seller's `ChileanPaymentConfig` for the chosen provider.
3. Creates a Payment row in `PROCESSING`.
4. Calls the provider adapter **synchronously** (the redirect URL IS what the user is waiting on; BullMQ is reserved for async reconciliation).
5. Persists `externalId` / `externalToken` and returns the `CreatePaymentResult` union.

DTO at [`src/payments/dto/create-payment.input.ts`](../../ekoru-transactions/src/payments/dto/create-payment.input.ts) — only `orderId`, `provider`, `returnUrl`. Amount/currency/receiver come from the Order.

### 2.5 Provider adapters

[`src/payments/providers/`](../../ekoru-transactions/src/payments/providers/):

- `provider-adapter.ts` — `ProviderAdapter` interface (`initiate`, `confirm`, `handleWebhook`) + shared arg shapes.
- `webpay.adapter.ts` — Transbank SDK. Uses `IntegrationCommerceCodes.WEBPAY_PLUS` in SANDBOX, seller's own creds in PRODUCTION. `buyOrder` capped at 26 chars per Transbank rules. Webpay has no async webhook; the return URL POST IS the signal.
- `khipu.adapter.ts` — Khipu v3 REST (`payment-api.khipu.com/v3/payments`). Returns `simplified_transfer_url` when present. HMAC-SHA256 signature verification helper for webhooks.
- `mercadopago.adapter.ts` — Checkout Pro (Preference API). Uses `sandbox_init_point` when `environment === 'SANDBOX'`.
- `index.ts` exports a `ProviderRegistry` that maps `ChileanPaymentProvider` → adapter.

Each adapter lazy-loads its SDK so the subgraph can boot without all three installed during the migration window.

### 2.6 Internal mutations for the gateway

The gateway never talks to the database directly. After confirming with the
provider, it calls back into transactions through these GraphQL mutations:

```graphql
mutation processProviderReturn($provider: ChileanPaymentProvider!, $payload: JSON!, $internalSecret: String!): PaymentStatus!
mutation processProviderWebhook($provider: ChileanPaymentProvider!, $eventType: String!, $payload: JSON!, $internalSecret: String!): PaymentStatus!
```

Both check the shared `INTERNAL_SERVICE_SECRET` (either via the
`x-internal-secret` header the gateway propagates through Apollo Federation
or via the explicit `internalSecret` argument — useful for dev curls).
[`src/payments/payments.resolver.ts`](../../ekoru-transactions/src/payments/payments.resolver.ts).

The transactions context picks up the header in [`src/app.module.ts`](../../ekoru-transactions/src/app.module.ts) and exposes it as `ctx.internalSecret`.

When a provider returns/webhooks `COMPLETED`, `PaymentsService` flips the
linked `Order` to `PAID`; on `FAILED|CANCELLED|EXPIRED` it flips
`PENDING_PAYMENT` orders to `CANCELED` (idempotent — only matches
pending-payment rows so re-deliveries don't clobber state).

---

## 3. Gateway (`ekoru-gateway`)

### 3.1 Federation

`transactions` is now uncommented in [`src/app.module.ts`](../../ekoru-gateway/src/app.module.ts) under the subgraph list. Requires `EKORU_TRANSACTIONS_DEV_URL` (and `_STAGING_URL`, `_PROD_URL` per environment) in the gateway env.

The `AuthenticatedDataSource` now also propagates `x-internal-secret` to subgraph requests so transactions' internal mutations can verify the call is from the gateway.

### 3.2 PaymentsController

New module at [`src/payments/`](../../ekoru-gateway/src/payments/) with:

- `POST /payments/return/webpay` — handles Transbank's form-POST (`token_ws`, `TBK_ORDEN_COMPRA`), forwards to transactions' `processProviderReturn`, then `303 Location: ${webAppOrigin}/${lang}/cart/confirmation?paymentId=…`.
- `GET /payments/return/:provider` (`khipu`, `mercadopago`) — same shape but for GET-style returns.
- `POST /payments/webhook/khipu` — checks `x-khipu-signature` is present (full HMAC verification happens in transactions after the payment is resolved, because each seller has a different webhook secret).
- `POST /payments/webhook/mercadopago` — accepts the IPN body, forwards. TODO: verify `x-signature` against the seller's `webhookSecret` (same deferred-resolution pattern as Khipu).

The `PaymentsService` ([`src/payments/payments.service.ts`](../../ekoru-gateway/src/payments/payments.service.ts)) calls the transactions GraphQL endpoint directly with the internal secret header — it does NOT go through the public federated gateway for these internal mutations.

---

## 4. What you still need to do locally

These are the things I can't do for you (database access, npm registry, sandbox credentials).

### 4.1 Install provider SDKs

In `ekoru-transactions`:

```bash
npm i transbank-sdk mercadopago
```

(Khipu uses plain `fetch` — no SDK needed.) The adapters lazy-import these so the subgraph still boots if a package is missing; they only throw when an actual payment is attempted with that provider.

### 4.2 Run the Prisma migration

From the monorepo root:

```bash
npx prisma migrate dev --schema prisma/schema.prisma --name checkout_orders_addresses
```

Then in `ekoru-transactions` so the client picks up `Order.status`, `tx.shippingAddress`, and the `MERCADOPAGO` enum value:

```bash
cd ekoru-transactions
npx prisma generate
```

You'll see IDE/TS errors in [`payments.service.ts`](../../ekoru-transactions/src/payments/payments.service.ts) and [`orders.service.ts`](../../ekoru-transactions/src/orders/orders.service.ts) until `prisma generate` runs — those are stale client types, not real bugs.

### 4.3 Env vars

**`ekoru-transactions`:**

```ini
MARKETPLACE_URL=http://localhost:4001/graphql       # internal subgraph URL
GATEWAY_BASE_URL=http://localhost:4000              # used to build provider notify URLs
INTERNAL_SERVICE_SECRET=<a-long-random-string>
```

**`ekoru-gateway`:**

```ini
EKORU_TRANSACTIONS_DEV_URL=http://localhost:4006/graphql
INTERNAL_SERVICE_SECRET=<same string as transactions>
WEB_APP_BASE_URL=http://localhost:3000              # fallback when Referer header is missing
```

Per-seller credentials live on `ChileanPaymentConfig` rows (not env). For local sandbox testing you can either:

- Create a config row for each seller with `environment = SANDBOX` and leave `merchantId/secretKey` null — the Webpay adapter falls back to Transbank's public integration creds (`597055555532`).
- Use the same pattern for Khipu/MercadoPago with their respective sandbox tokens.

### 4.4 Marketplace `productsByIds` resolver

`MarketplaceClient.getPrices` calls:

```graphql
query GetProductPricesForCheckout($ids: [Int!]!) {
  productsByIds(ids: $ids) {
    id sellerId price hasOffer offerPrice isActive
  }
}
```

That resolver doesn't exist in the marketplace subgraph yet. Adding it is a 10-line addition to the marketplace `products.resolver.ts` — just a `findMany({ where: { id: { in: ids } } })` and a `select` of those six fields.

Until that's added, `createOrder` will fail with "Productos no encontrados".

### 4.5 Carrier shipping

The CARRIER shipping method is intentionally rejected at the service layer with "Cotización de courier aún no disponible" until you wire a real quote endpoint (Chilexpress / Starken). The web app already shows a disabled tile so the buyer can't pick it.

### 4.6 Webhook signature verification (MercadoPago)

The MercadoPago controller currently only rejects empty bodies. Add `x-signature` HMAC verification once you have a seller's webhook secret stored in `ChileanPaymentConfig.secretKey` — same deferred-resolution pattern as Khipu (verify inside the transactions adapter after looking up the payment).

---

## 5. Open product questions

These shape downstream PRs. Worth deciding before going to production.

- **Multi-seller carts.** Today rejected at `createOrder` with a clear message. Long-term: split into one order per seller at the cart layer with a clearer UX.
- **Where commission/fees live.** `Payment.fees` and `netAmount` columns exist but aren't populated yet. Affects whether `ChileanPaymentConfig` points at the seller's own account or Ekoru's platform account.
- **Sandbox platform-default config.** For dev sellers without merchant creds, consider adding `isPlatformDefault: Boolean` to `ChileanPaymentConfig` and picking that when the seller has no active config. The Webpay adapter already falls back to integration creds in SANDBOX, but Khipu/MercadoPago need per-account tokens even in test mode.
- **Refund UX.** `refundPayment` resolver works; no buyer/seller surface yet.
- **MercadoPago effort vs. local share.** Lower bank-transfer share than Khipu in Chile but accepts international cards. Confirm with the commercial side it's worth ongoing maintenance.
- **`Product.currency`.** Cart defaults to CLP. Multi-country needs a currency field on `Product`/`StoreProduct` (or on the seller) so the server can reject mixed-currency carts.
