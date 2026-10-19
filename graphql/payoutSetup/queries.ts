import { gql } from "@apollo/client";

// The signed-in business's Mercado Pago connection (ekoru-transactions
// MercadoPagoConnectResolver). Free for every approved business; never
// carries a token.

export const STORE_PAYMENT_SETUP_FIELDS = `
  provider
  connected
  needsReconnect
  accountId
  environment
  connectedAt
  tokenExpiresAt
  commissionRate
`;

export const MY_STORE_PAYMENT_SETUP = gql`
  query MyStorePaymentSetup {
    myStorePaymentSetup {
      ${STORE_PAYMENT_SETUP_FIELDS}
    }
  }
`;
