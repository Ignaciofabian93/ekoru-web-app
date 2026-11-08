import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { CategoryFilter } from "./CategoryFilter";

beforeAll(() => {
  // The scrollable row measures itself; jsdom has no ResizeObserver.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const categories = [
  { slug: "cosmetica", name: "Cosmética" },
  { slug: "deporte", name: "Deporte" },
];

function renderFilter(activeSlug: string | null, onSelect = vi.fn()) {
  render(
    <CategoryFilter
      title="Categorías"
      allLabel="Todas las categorías"
      categories={categories}
      activeSlug={activeSlug}
      onSelect={onSelect}
    />,
  );
  return onSelect;
}

describe("CategoryFilter", () => {
  it("marks the selected category", () => {
    renderFilter("deporte");

    expect(screen.getByRole("tab", { name: "Deporte" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Todas las categorías" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("falls back to all for an unknown slug", () => {
    renderFilter("gone");

    expect(screen.getByRole("tab", { name: "Todas las categorías" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("filters in place: a category passes its slug, all passes null", async () => {
    const onSelect = renderFilter(null);

    await userEvent.click(screen.getByRole("tab", { name: "Cosmética" }));
    await userEvent.click(screen.getByRole("tab", { name: "Todas las categorías" }));

    expect(onSelect.mock.calls).toEqual([["cosmetica"], [null]]);
    // Buttons, not links: selecting never leaves the page.
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("shows a placeholder row while the catalog loads", () => {
    render(
      <CategoryFilter
        title="Categorías"
        allLabel="Todas las categorías"
        categories={[]}
        activeSlug={null}
        onSelect={vi.fn()}
        loading
      />,
    );

    expect(screen.getByRole("heading", { name: "Categorías" })).toBeInTheDocument();
    expect(screen.queryByRole("tab")).toBeNull();
  });
});
