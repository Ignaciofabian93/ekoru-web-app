import { gql } from "@apollo/client";

/**
 * Peer-to-peer marketplace deals (cash sales + exchanges) from the transactions
 * subgraph. `product` / `requestedProduct` / `offeredProduct` are federation
 * refs into ekoru-marketplace, so we can pull name/images/price inline.
 */
export const DEAL_FIELDS = gql`
  fragment DealFields on P2PDeal {
    id
    type
    status
    buyerId
    sellerId
    compensationAmount
    compensationPayerId
    confirmationDeadline
    buyerConfirmedAt
    sellerConfirmedAt
    buyerEvidenceUrl
    sellerEvidenceUrl
    disputeReason
    completedAt
    createdAt
    product {
      id
      name
      images
      price
    }
    requestedProduct {
      id
      name
      images
      price
    }
    offeredProduct {
      id
      name
      images
      price
    }
  }
`;

export const MY_DEALS_AS_BUYER = gql`
  ${DEAL_FIELDS}
  query MyDealsAsBuyer {
    myDealsAsBuyer {
      ...DealFields
    }
  }
`;

export const MY_DEALS_AS_SELLER = gql`
  ${DEAL_FIELDS}
  query MyDealsAsSeller {
    myDealsAsSeller {
      ...DealFields
    }
  }
`;

export const GET_DEAL = gql`
  ${DEAL_FIELDS}
  query GetDeal($id: Int!) {
    deal(id: $id) {
      ...DealFields
    }
  }
`;

export const MY_P2P_REPUTATION = gql`
  query MyP2PReputation {
    myP2PReputation {
      strikes
      blockedUntil
      completedCount
      failedCount
    }
  }
`;
