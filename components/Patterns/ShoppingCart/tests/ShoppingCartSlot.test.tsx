import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { ShoppingCartSlot } from "../ShoppingCartSlot";

vi.mock("next/navigation", () => ({ useParams: () => ({ lang: "es" }) }));
vi.mock("@/store/useAuthStore", () => ({ useIsAuthenticated: () => true }));
vi.mock("@/store/useCartStore", () => ({
  default: (select: (s: { isHydrated: boolean }) => unknown) => select({ isHydrated: true }),
  useCartCount: () => 0,
}));

const copy = { text: "Mi carro", label: "Mi carro, vacío" };

function renderSlot(loading: boolean) {
  const utils = render(<ShoppingCartSlot {...copy} loading={loading} />);
  return {
    ...utils,
    update: (next: boolean) => utils.rerender(<ShoppingCartSlot {...copy} loading={next} />),
  };
}

const getSkeleton = (container: HTMLElement) => container.querySelector(".animate-pulse");
const getCart = () => screen.queryByRole("link", { name: "Mi carro, vacío" });

describe("ShoppingCartSlot", () => {
  it("shows only the skeleton while loading", async () => {
    const { container } = renderSlot(true);

    expect(getSkeleton(container)).toBeInTheDocument();
    expect(getCart()).not.toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("fades the button in over the skeleton, then removes the skeleton", async () => {
    const { container, update } = renderSlot(true);
    update(false);

    const skeletonLayer = getSkeleton(container)?.parentElement;
    const cartLayer = getCart()?.parentElement;

    // Both share the grid cell, the button on top, so nothing moves or flashes.
    expect(skeletonLayer).toHaveClass("col-start-1", "row-start-1");
    expect(cartLayer).toHaveClass("col-start-1", "row-start-1", "animate-fade-in");
    expect(skeletonLayer?.nextElementSibling).toBe(cartLayer);
    expect((await axe(container)).violations).toEqual([]);

    fireEvent.animationEnd(cartLayer!);

    expect(getSkeleton(container)).not.toBeInTheDocument();
    expect(getCart()).toBeInTheDocument();
    expect(getCart()?.parentElement).not.toHaveClass("animate-fade-in");
  });

  it("ignores animations from inside the layers", () => {
    const { container, update } = renderSlot(true);
    update(false);

    fireEvent.animationEnd(getSkeleton(container)!);
    fireEvent.animationEnd(getCart()!);

    expect(getSkeleton(container)).toBeInTheDocument();
  });

  it("shows the button with no skeleton or fade when nothing is loading", () => {
    const { container } = renderSlot(false);

    expect(getCart()).toBeInTheDocument();
    expect(getCart()?.parentElement).not.toHaveClass("animate-fade-in");
    expect(getSkeleton(container)).not.toBeInTheDocument();
  });
});
