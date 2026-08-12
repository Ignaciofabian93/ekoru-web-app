import { gql } from "@apollo/client";

import { PAYMENT_FIELDS_FRAGMENT } from "./fragments";

export const GET_PAYMENT_STATUS = gql`
  ${PAYMENT_FIELDS_FRAGMENT}
  query GetPaymentStatus($paymentId: ID!) {
    payment(id: $paymentId) {
      ...PaymentFields
    }
  }
`;

/**
 * Order history for the signed-in buyer. `getOrdersByBuyer` takes the buyer
 * from the JWT, so there is no id to pass — an unauthenticated call returns
 * nothing rather than someone else's orders.
 *
 * `product` / `storeProduct` are federation refs: transactions stores only the
 * catalogue id, and the gateway resolves the name and image from marketplace /
 * stores in the same round trip. Exactly one of the two is set per line.
 */
export const GET_MY_ORDERS = gql`
  query GetMyOrders($page: Int = 1, $pageSize: Int = 10) {
    getOrdersByBuyer(page: $page, pageSize: $pageSize) {
      nodes {
        id
        status
        total
        currency
        createdAt
        shippingMethod
        shippingStatus {
          id
          status
        }
        orderItems {
          id
          quantity
          price
          product {
            id
            name
            images
          }
          storeProduct {
            id
            name
            images
          }
        }
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
