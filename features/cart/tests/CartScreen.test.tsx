import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import useCartStore, { type CartItem } from "@/store/useCartStore";
import { axe } from "@/test/axe";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import { CartScreen } from "../ui/CartScreen";

// The real one reads the language off the app router, which isn't mounted here.
vi.mock("@/hooks/useFormatPrice", () => ({
  useFormatPrice: () => (value: number) => `$${value}`,
}));

const line = (overrides: Partial<CartItem>): CartItem => ({
  productId: 1,
  source: "store",
  name: "Taza de gres",
  unitPrice: 1000,
  quantity: 1,
  currency: "CLP",
  sellerId: "s1",
  sellerName: "Greda Viva",
  maxStock: 3,
  ...overrides,
});

const TWO_SELLERS = [
  line({ productId: 1, name: "Taza de gres", quantity: 2 }),
  line({ productId: 2, name: "Plato hondo", unitPrice: 500 }),
  line({ productId: 3, name: "Bolsa de yute", sellerId: "s2", sellerName: "Yute Sur" }),
];

function renderCart(items: CartItem[]) {
  useCartStore.setState({ items, isHydrated: true });
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
      <CartScreen lang="es" />
    </DictionaryProvider>,
  );
}

/** The two-column block a seller's items and order summary share. */
const sellerBlock = (seller: string) =>
  screen.getByRole("heading", { name: seller }).closest("section")!
    .parentElement as HTMLElement;

describe("CartScreen", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isHydrated: true });
  });

  it("gives every seller its own summary and pay link, and no whole-cart checkout", () => {
    renderCart(TWO_SELLERS);

    expect(screen.getByText("4 productos · 2 vendedores")).toBeInTheDocument();
    expect(screen.getByText(/Cada vendedor se paga por separado/)).toBeInTheDocument();

    const payLinks = screen.getAllByRole("link", { name: /^Pagar/ });
    expect(payLinks.map((a) => a.getAttribute("href"))).toEqual([
      "/es/cart/checkout?g=store%3As1",
      "/es/cart/checkout?g=store%3As2",
    ]);

    const greda = within(sellerBlock("Greda Viva"));
    expect(greda.getByRole("link", { name: "Pagar · Greda Viva" })).toBeInTheDocument();
    // 2 × 1000 + 500, and shipping is left to checkout rather than guessed.
    expect(greda.getAllByText("$2500")).toHaveLength(2);
    expect(greda.getByText("Se elige en el pago")).toBeInTheDocument();
    expect(greda.getByRole("link", { name: "Ver tienda" })).toHaveAttribute(
      "href",
      "/es/seller/s1",
    );
  });

  it("changes a quantity within stock and updates the seller's totals", async () => {
    const user = userEvent.setup();
    renderCart([line({ quantity: 2 })]);

    const stepper = screen.getByRole("group", { name: "Cantidad" });
    await user.click(within(stepper).getByRole("button", { name: "Aumentar cantidad" }));

    expect(useCartStore.getState().items[0].quantity).toBe(3);
    expect(screen.getAllByText("$3000")).toHaveLength(3); // line, subtotal, total
    expect(screen.getByText("Máximo disponible")).toBeInTheDocument();
    expect(
      within(stepper).getByRole("button", { name: "Aumentar cantidad" }),
    ).toBeDisabled();
  });

  it("drops a seller's block once its last item is removed", async () => {
    const user = userEvent.setup();
    renderCart(TWO_SELLERS);

    const yute = within(sellerBlock("Yute Sur"));
    await user.click(yute.getByRole("button", { name: "Eliminar" }));

    expect(screen.queryByRole("heading", { name: "Yute Sur" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Cada vendedor se paga por separado/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^Pagar/ })).toHaveLength(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderCart(TWO_SELLERS);

    expect((await axe(container)).violations).toEqual([]);
  });
});
