import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import { StoreProductCard } from "../StoreProductCard";

const state = vi.hoisted(() => ({
  flags: { cardAddToCart: false, storePurchase: true },
  addStoreProduct: vi.fn(),
}));

vi.mock("@/constants/features", () => ({
  FEATURES: {
    get cardAddToCart() {
      return { available: state.flags.cardAddToCart, surfaces: "" };
    },
    get storePurchase() {
      return { available: state.flags.storePurchase, surfaces: "" };
    },
  },
}));
vi.mock("@/features/cart/hooks/useAddToCart", () => ({
  useAddToCart: () => ({ addStoreProduct: state.addStoreProduct }),
}));
vi.mock("@/features/cart/hooks/useCartQuantity", () => ({
  useCartQuantity: () => ({ quantity: 0, setQuantity: vi.fn() }),
}));
vi.mock("@/hooks/useIsOwnProduct", () => ({ useIsOwnProduct: () => false }));
vi.mock("@/hooks/useToggleFavorite", () => ({
  useToggleFavorite: () => ({ toggleFavorite: vi.fn() }),
}));
vi.mock("@/store/useAuthStore", () => ({ useIsAuthenticated: () => false }));
// The real one reads the language off the app router, which isn't mounted here.
vi.mock("@/hooks/useFormatPrice", () => ({
  useFormatPrice: () => (value: number) => `$${value}`,
}));

const product = {
  id: 7,
  name: "Taza de gres",
  price: 12000,
  stock: 3,
  isLowStock: true,
  averageRating: 4.5,
  sellerId: "s1",
  seller: { id: "s1", county: { id: 1, county: "Ñuñoa" } },
} as const;

function renderCard(overrides: Partial<Record<keyof typeof product, unknown>> = {}) {
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
      {/* The projection is structural; the seller stub carries what the card reads. */}
      <StoreProductCard product={{ ...product, ...overrides } as never} lang="es" />
    </DictionaryProvider>,
  );
}

describe("StoreProductCard", () => {
  beforeEach(() => {
    state.flags.cardAddToCart = false;
    state.flags.storePurchase = true;
    state.addStoreProduct.mockReset();
  });

  it("shows the name, where it is and the stock warning", () => {
    const { container } = renderCard();
    // The back face titles itself with the name too; read the face in view.
    const front = within(container.querySelector<HTMLElement>(".card-face:not([inert])")!);

    expect(front.getByText("Taza de gres")).toBeInTheDocument();
    expect(front.getByText("Ñuñoa")).toBeInTheDocument();
    expect(front.getByText("Solo quedan 3")).toBeInTheDocument();
    expect(front.getByText("4.5 de 5")).toBeInTheDocument();
  });

  it("leaves adding to the cart to the product page while the flag is off", () => {
    renderCard();

    expect(screen.queryByRole("button", { name: "Añadir al carrito" })).toBeNull();
    expect(screen.getByText("Ver detalles")).toBeInTheDocument();
  });

  it("brings the add-to-cart button back when the flag flips", async () => {
    state.flags.cardAddToCart = true;
    renderCard();

    await userEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));
    expect(state.addStoreProduct).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7 }),
      1,
    );
  });

  it("says it is out of stock rather than adding when nothing is left", () => {
    state.flags.cardAddToCart = true;
    renderCard({ stock: 0, isLowStock: false });

    expect(screen.getByRole("button", { name: "Agotado" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Añadir al carrito" })).toBeNull();
  });

  it("turns over to the material composition from the rotate button", async () => {
    renderCard();

    await userEvent.click(screen.getByRole("button", { name: "Ver impacto ambiental" }));
    expect(screen.getByRole("button", { name: "Volver al producto" })).toBeInTheDocument();
  });
});
