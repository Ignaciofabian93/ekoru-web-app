import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { skeletonClass } from "@/design/skeleton";
import { axe } from "@/test/axe";
import { ShoppingCartButton } from "../ShoppingCart";
import { ShoppingCartSkeleton } from "../ShoppingCartSkeleton";

vi.mock("next/navigation", () => ({ useParams: () => ({ lang: "es" }) }));
vi.mock("@/store/useCartStore", () => ({
  default: (select: (s: { isHydrated: boolean }) => unknown) =>
    select({ isHydrated: true }),
  useCartCount: () => 0,
}));

function renderSkeleton(text = "Mi carro") {
  const { container } = render(<ShoppingCartSkeleton text={text} />);
  return { container, skeleton: container.firstElementChild as HTMLElement };
}

describe("ShoppingCartSkeleton", () => {
  it("is hidden from assistive tech and not focusable", async () => {
    const user = userEvent.setup();
    const { container, skeleton } = renderSkeleton();

    await user.tab();

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.body).toHaveFocus();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("pulses like the other skeletons, without the button's border, pointer or hover", () => {
    const { skeleton } = renderSkeleton();

    expect(skeleton).toHaveClass(...skeletonClass.md.split(" "));
    expect(skeleton).toHaveClass("cursor-default", "hover:filter-none");
    expect(skeleton).not.toHaveClass("btn-secondary");
  });

  it("takes up exactly the space of the button it stands in for", () => {
    render(<ShoppingCartButton text="Mi carro" />);
    const { skeleton } = renderSkeleton("Mi carro");
    const button = screen.getByRole("link");

    // Same box: `.btn` padding, border and gap, plus the button's own padding.
    for (const cls of ["btn", "px-2", "sm:px-4"]) {
      expect(button).toHaveClass(cls);
      expect(skeleton).toHaveClass(cls);
    }

    // Same icon size.
    const buttonIcon = button.querySelector("svg");
    const skeletonIcon = skeleton.querySelector("svg");
    expect(skeletonIcon).toHaveAttribute("width", buttonIcon?.getAttribute("width"));
    expect(skeletonIcon).toHaveAttribute("height", buttonIcon?.getAttribute("height"));

    // Same label, icon-only below `sm` in both.
    const labelClasses = ["hidden", "whitespace-nowrap", "sm:inline"];
    expect(within(button).getByText("Mi carro")).toHaveClass(...labelClasses);
    expect(within(skeleton).getByText("Mi carro")).toHaveClass(...labelClasses);
  });

  it("only reserves space with its content, which stays invisible", () => {
    const { skeleton } = renderSkeleton();

    expect(skeleton.querySelector("svg")).toHaveClass("invisible");
    expect(within(skeleton).getByText("Mi carro")).toHaveClass("invisible");
  });

  it('defaults its label to "My cart", like the button', () => {
    const { container } = render(<ShoppingCartSkeleton />);

    expect(within(container).getByText("My cart")).toBeInTheDocument();
  });
});
