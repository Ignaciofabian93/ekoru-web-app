import { render, screen } from "@testing-library/react";
import { Leaf, Users } from "lucide-react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { CategoryRow, type CategoryRowItem } from "./CategoryRow";

beforeAll(() => {
  // The rail measures itself; jsdom has no ResizeObserver.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const items: CategoryRowItem[] = [
  {
    id: 1,
    name: "Vida sustentable",
    href: "/es/blog/vida-sustentable",
    Icon: Leaf,
    caption: "2 artículos",
  },
  { id: 5, name: "Comunidad", href: "/es/blog/comunidad", Icon: Users },
];

function renderRow(props: { items: CategoryRowItem[]; loading?: boolean }) {
  return render(
    <CategoryRow
      title="Explora por categoría"
      scrollPreviousLabel="Anterior"
      scrollNextLabel="Siguiente"
      {...props}
    />,
  );
}

describe("CategoryRow", () => {
  it("links each category to its page, with its name and count", async () => {
    const { container } = renderRow({ items });

    const link = screen.getByRole("link", { name: /Vida sustentable/ });
    expect(link).toHaveAttribute("href", "/es/blog/vida-sustentable");
    expect(link).toHaveTextContent("2 artículos");
    expect(
      screen.getByRole("region", { name: "Explora por categoría" }),
    ).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("shows a category without its count while counts are unknown", () => {
    renderRow({ items });
    expect(screen.getByRole("link", { name: "Comunidad" })).toBeInTheDocument();
  });

  it("shows placeholders while loading and nothing once empty", () => {
    const { container, rerender } = renderRow({ items: [], loading: true });
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <CategoryRow
        title="Explora por categoría"
        items={[]}
        scrollPreviousLabel="Anterior"
        scrollNextLabel="Siguiente"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
