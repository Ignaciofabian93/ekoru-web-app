import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { ShoppingCartButton } from "./ShoppingCart";

const state = vi.hoisted(() => ({ count: 0 }));

vi.mock("next/navigation", () => ({ useParams: () => ({ lang: "es" }) }));
vi.mock("@/store/useCartStore", () => ({
  default: (select: (s: { isHydrated: boolean }) => unknown) => select({ isHydrated: true }),
  useCartCount: () => state.count,
}));

const copy = {
  text: "Mi carro",
  label: "Mi carro, vacío",
  labelWithOneItem: "Mi carro, 1 producto",
  labelWithItems: "Mi carro, {{count}} productos",
};

beforeEach(() => {
  state.count = 0;
});

describe("ShoppingCartButton", () => {
  it("shows its label like the account button and links to the cart", async () => {
    const { container } = render(<ShoppingCartButton {...copy} />);

    const link = screen.getByRole("link", { name: "Mi carro, vacío" });
    expect(link).toHaveAttribute("href", "/es/cart");
    expect(link).toHaveClass("btn", "btn-secondary");
    expect(link).toHaveTextContent("Mi carro");
    expect((await axe(container)).violations).toEqual([]);
  });

  it("names the item count and shows it in the badge", () => {
    state.count = 3;
    render(<ShoppingCartButton {...copy} />);

    const link = screen.getByRole("link", { name: "Mi carro, 3 productos" });
    expect(link).toHaveTextContent("3");
  });
});
