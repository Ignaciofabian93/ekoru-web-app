import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import { ProductScroller } from "../ProductScroller";

// jsdom has no ResizeObserver; the rail only uses it to toggle its arrows.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

type Item = { id: number; name: string };

function renderScroller(props: { items: Item[]; loading?: boolean }) {
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
      <ProductScroller
        {...props}
        empty={<p>Nada por aquí</p>}
        renderItem={(item) => <article>{item.name}</article>}
      />
    </DictionaryProvider>,
  );
}

describe("ProductScroller", () => {
  it("gives every product the same slot, with arrows to move the rail", () => {
    renderScroller({ items: [{ id: 1, name: "Bici" }, { id: 2, name: "Taza" }] });

    for (const name of ["Bici", "Taza"]) {
      expect(screen.getByText(name).parentElement).toHaveClass("w-44", "md:w-50", "lg:w-60");
    }
    expect(screen.getByRole("button", { name: "Ver anteriores" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver más" })).toBeInTheDocument();
  });

  it("holds the rail open with placeholders while the first page loads", () => {
    const { container } = renderScroller({ items: [], loading: true });

    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(6);
    expect(screen.queryByText("Nada por aquí")).not.toBeInTheDocument();
  });

  it("shows the caller's empty state once there is nothing to list", () => {
    renderScroller({ items: [] });

    expect(screen.getByText("Nada por aquí")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ver más" })).not.toBeInTheDocument();
  });
});
