import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { BusinessRow, type BusinessRowItem } from "./BusinessRow";

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

const items: BusinessRowItem[] = [
  { sellerId: "s1", name: "Pacto Pirata", logo: null, caption: "3 productos" },
  { sellerId: "s2", name: "Verde Vivo", logo: null, caption: "1 producto" },
];

function renderRow(props: { items: BusinessRowItem[]; loading?: boolean }) {
  return render(
    <BusinessRow
      lang="es"
      title="Tiendas"
      scrollPreviousLabel="Anterior"
      scrollNextLabel="Siguiente"
      {...props}
    />,
  );
}

describe("BusinessRow", () => {
  it("links each business to its profile, with its name and count", () => {
    renderRow({ items });

    const link = screen.getByRole("link", { name: /Pacto Pirata/ });
    expect(link).toHaveAttribute("href", "/es/seller/s1");
    expect(link).toHaveTextContent("3 productos");
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders nothing once loaded with no businesses", () => {
    const { container } = renderRow({ items: [] });

    expect(container).toBeEmptyDOMElement();
  });

  it("keeps its place with placeholders while loading", () => {
    renderRow({ items: [], loading: true });

    expect(screen.getByRole("heading", { name: "Tiendas" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
