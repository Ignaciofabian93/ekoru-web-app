import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import useCartStore, { type CartItem } from "@/store/useCartStore";
import { axe } from "@/test/axe";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import type { CheckoutStep } from "../hooks/useCheckout";
import { CheckoutScreen } from "../ui/CheckoutScreen";
import { ShippingMethodPicker } from "../ui/ShippingMethodPicker";

vi.mock("@/hooks/useFormatPrice", () => ({
  useFormatPrice: () => (value: number) => `$${value}`,
}));

// The real hook needs Apollo and the router; the screen only reads its state.
const checkout = vi.hoisted(() => ({
  step: "shipping" as CheckoutStep,
  shippingMethod: null as string | null,
  isShippingValid: false,
  isPaymentValid: false,
  goNext: vi.fn(),
  goBack: vi.fn(),
  setShippingMethod: vi.fn(),
}));
vi.mock("../hooks/useCheckout", () => ({
  useCheckout: () => ({
    ...checkout,
    isEmpty: false,
    count: 2,
    subtotal: 2000,
    total: 2000,
    currency: "CLP",
    sellerName: "Greda Viva",
    shippingQuote: { status: "FREE", amount: 0 },
    address: {},
    provider: "MERCADOPAGO",
    loading: false,
    pay: vi.fn(),
    setProvider: vi.fn(),
    updateAddressField: vi.fn(),
    goToMidPointChat: vi.fn(),
  }),
}));

const ITEM: CartItem = {
  productId: 1,
  source: "store",
  name: "Taza de gres",
  unitPrice: 1000,
  quantity: 2,
  currency: "CLP",
  sellerId: "s1",
  sellerName: "Greda Viva",
};

const withDictionary = (ui: React.ReactNode) =>
  render(<DictionaryProvider dictionary={{ [NAMESPACE]: es }}>{ui}</DictionaryProvider>);

const summary = () => within(screen.getByRole("region", { name: "Resumen del pedido" }));

describe("ShippingMethodPicker", () => {
  it("offers only store pickup and a meeting point while delivery is off", () => {
    withDictionary(<ShippingMethodPicker value={null} onChange={vi.fn()} />);

    const options = screen.getAllByRole("button").map((b) => b.textContent);
    expect(options).toEqual([
      expect.stringContaining("Retiro en local"),
      expect.stringContaining("Punto intermedio"),
    ]);
    expect(screen.queryByText("Envío a domicilio")).not.toBeInTheDocument();
    expect(screen.queryByText(/Courier/)).not.toBeInTheDocument();
  });
});

describe("CheckoutScreen", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [ITEM], isHydrated: true });
    Object.assign(checkout, {
      step: "shipping",
      shippingMethod: null,
      isShippingValid: false,
      isPaymentValid: false,
    });
    checkout.goNext.mockReset();
    checkout.goBack.mockReset();
  });

  it("puts Continue inside the order summary, held until a method is chosen", async () => {
    const { rerender } = withDictionary(<CheckoutScreen lang="es" />);

    const cont = summary().getByRole("button", { name: "Continuar" });
    expect(cont).toBeDisabled();
    // The first step has nowhere to go back to but the cart, linked above.
    expect(summary().queryByRole("button", { name: "Paso anterior" })).toBeNull();

    Object.assign(checkout, { shippingMethod: "IN_HOUSE_PICKUP", isShippingValid: true });
    rerender(
      <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
        <CheckoutScreen lang="es" />
      </DictionaryProvider>,
    );
    await userEvent.click(summary().getByRole("button", { name: "Continuar" }));
    expect(checkout.goNext).toHaveBeenCalledTimes(1);
  });

  it("steps back from inside the summary once past shipping", async () => {
    Object.assign(checkout, { step: "payment", isShippingValid: true });
    withDictionary(<CheckoutScreen lang="es" />);

    await userEvent.click(summary().getByRole("button", { name: "Paso anterior" }));
    expect(checkout.goBack).toHaveBeenCalledTimes(1);
  });

  it("pays from the summary on the review step", () => {
    Object.assign(checkout, { step: "review", isShippingValid: true, isPaymentValid: true });
    withDictionary(<CheckoutScreen lang="es" />);

    expect(summary().getByRole("button", { name: "Pagar $2000" })).toBeEnabled();
    expect(summary().queryByRole("button", { name: "Continuar" })).toBeNull();
  });

  it("has no accessibility violations", async () => {
    Object.assign(checkout, { shippingMethod: "IN_MID_POINT_PICKUP" });
    const { container } = withDictionary(<CheckoutScreen lang="es" />);

    expect((await axe(container)).violations).toEqual([]);
  });
});
