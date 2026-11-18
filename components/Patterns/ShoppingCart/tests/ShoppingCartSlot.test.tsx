import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { ShoppingCartSlot } from "../ShoppingCartSlot";

vi.mock("next/navigation", () => ({ useParams: () => ({ lang: "es" }) }));
vi.mock("@/store/useCartStore", () => ({
  default: (select: (s: { isHydrated: boolean }) => unknown) => select({ isHydrated: true }),
  useCartCount: () => 0,
}));

const copy = { text: "Mi carro", label: "Mi carro, vacío" };

function renderSlot(props: { loading: boolean; visible: boolean }) {
  const utils = render(<ShoppingCartSlot {...copy} {...props} />);
  return {
    ...utils,
    update: (next: { loading: boolean; visible: boolean }) =>
      utils.rerender(<ShoppingCartSlot {...copy} {...next} />),
  };
}

const getSkeleton = (container: HTMLElement) => container.querySelector(".animate-pulse");
const getCart = () => screen.queryByRole("link", { name: "Mi carro, vacío" });

describe("ShoppingCartSlot", () => {
  it("shows only the skeleton while loading", async () => {
    const { container } = renderSlot({ loading: true, visible: false });

    expect(getSkeleton(container)).toBeInTheDocument();
    expect(getCart()).not.toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("fades the button in over the skeleton, then removes the skeleton", async () => {
    const { container, update } = renderSlot({ loading: true, visible: false });
    // Auth sets the seller first and flips `isHydrated` right after.
    update({ loading: true, visible: true });
    update({ loading: false, visible: true });

    const skeletonLayer = getSkeleton(container)?.parentElement;
    const cartLayer = getCart()?.parentElement;

    // Both share the grid cell, the button on top, so nothing moves or flashes.
    expect(skeletonLayer).toHaveClass("col-start-1", "row-start-1");
    expect(cartLayer).toHaveClass("col-start-1", "row-start-1", "animate-fade-in");
    expect(skeletonLayer?.nextElementSibling).toBe(cartLayer);
    // The skeleton stays solid underneath rather than fading out with it.
    expect(skeletonLayer).not.toHaveClass("animate-fade-out");
    expect((await axe(container)).violations).toEqual([]);

    fireEvent.animationEnd(cartLayer!);

    expect(getSkeleton(container)).not.toBeInTheDocument();
    expect(getCart()).toBeInTheDocument();
  });

  it("ignores animations from inside the layers", () => {
    const { container, update } = renderSlot({ loading: true, visible: false });
    update({ loading: false, visible: true });

    fireEvent.animationEnd(getSkeleton(container)!);
    fireEvent.animationEnd(getCart()!);

    expect(getSkeleton(container)).toBeInTheDocument();
  });

  it("fades the skeleton out for a guest, then renders nothing", () => {
    const { container, update } = renderSlot({ loading: true, visible: false });
    update({ loading: false, visible: false });

    const skeletonLayer = getSkeleton(container)?.parentElement;
    expect(skeletonLayer).toHaveClass("animate-fade-out");
    expect(getCart()).not.toBeInTheDocument();

    fireEvent.animationEnd(skeletonLayer!);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the button with no skeleton when nothing is loading", () => {
    const { container } = renderSlot({ loading: false, visible: true });

    expect(getCart()).toBeInTheDocument();
    expect(getSkeleton(container)).not.toBeInTheDocument();
  });

  it("renders nothing for a guest once loaded", () => {
    const { container } = renderSlot({ loading: false, visible: false });

    expect(container).toBeEmptyDOMElement();
  });
});
