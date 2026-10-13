import { describe, expect, it } from "vitest";
import { lineImage, lineName, orderStage, type BuyerOrder } from "./useMyOrders";
import { SALES_FILTERS } from "./useMySales";
import { isPayable } from "./useQuotationPayment";

const order = (over: Partial<BuyerOrder>): BuyerOrder => ({
  id: "1",
  status: "PAID",
  subtotal: 10000,
  shippingCost: 0,
  total: 10000,
  currency: "CLP",
  createdAt: "2026-10-01T00:00:00.000Z",
  shippingMethod: "IN_HOUSE_PICKUP",
  ...over,
});

describe("orderStage", () => {
  it("shows cancelled and refunded orders as cancelled, whatever the shipment says", () => {
    const shipped = { id: "s", status: "SHIPPED" as const };
    expect(orderStage(order({ status: "CANCELED", shippingStatus: shipped }))).toBe(
      "CANCELED",
    );
    expect(orderStage(order({ status: "REFUNDED", shippingStatus: shipped }))).toBe(
      "CANCELED",
    );
  });

  it("shows an unpaid order as unpaid, not as preparing", () => {
    expect(orderStage(order({ status: "PENDING_PAYMENT" }))).toBe("PENDING_PAYMENT");
  });

  it("follows the shipment once paid, preparing until there is one", () => {
    expect(orderStage(order({}))).toBe("PREPARING");
    expect(orderStage(order({ shippingStatus: { id: "s", status: "DELIVERED" } }))).toBe(
      "DELIVERED",
    );
  });
});

describe("order lines", () => {
  it("reads the name and image from whichever catalogue the item came from", () => {
    const store = {
      id: "l1",
      quantity: 1,
      price: 5000,
      storeProduct: { id: 3, name: "Bolso", images: ["store/3.webp"] },
    };
    expect(lineName(store)).toBe("Bolso");
    expect(lineImage(store)).toBe("store/3.webp");
    expect(lineName({ id: "l2", quantity: 1, price: 1 })).toBeNull();
  });
});

describe("SALES_FILTERS", () => {
  it("maps 'to ship' to paid orders still being prepared", () => {
    expect(SALES_FILTERS.toShip).toEqual({ status: "PAID", stage: "PREPARING" });
  });

  it("sends no filter for 'all'", () => {
    expect(SALES_FILTERS.all).toEqual({});
  });
});

describe("isPayable", () => {
  it("lets the client pay an accepted, unpaid quote with a price", () => {
    expect(isPayable({ status: "ACCEPTED", finalPrice: 25000 })).toBe(true);
    expect(isPayable({ status: "ACCEPTED", estimatedPrice: 25000 })).toBe(true);
  });

  it("prefers the final price over the estimate", () => {
    expect(isPayable({ status: "ACCEPTED", finalPrice: 0, estimatedPrice: 25000 })).toBe(
      false,
    );
  });

  it("refuses quotes that are not accepted, already paid or free", () => {
    expect(isPayable({ status: "PENDING", finalPrice: 25000 })).toBe(false);
    expect(
      isPayable({
        status: "ACCEPTED",
        finalPrice: 25000,
        paidAt: "2026-10-10T00:00:00Z",
      }),
    ).toBe(false);
    expect(isPayable({ status: "ACCEPTED" })).toBe(false);
  });
});
