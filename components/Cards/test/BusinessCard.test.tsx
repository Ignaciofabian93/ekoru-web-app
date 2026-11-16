import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import { BusinessCard } from "../BusinessCard";
import type { BusinessCardProps } from "../types/Card.types";

function renderCard(props: Partial<BusinessCardProps> = {}) {
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
      <BusinessCard
        href="/es/seller/s1"
        itemType="BUSINESS"
        countKind="products"
        name="Brote Estudio"
        description="Objetos simples, hechos para acompañarte por años."
        location="Ñuñoa"
        {...props}
      />
    </DictionaryProvider>,
  );
}

describe("BusinessCard", () => {
  it("is one link to the business, named for it", () => {
    renderCard();

    expect(screen.getByRole("link", { name: "Brote Estudio" })).toHaveAttribute(
      "href",
      "/es/seller/s1",
    );
    // The footer's "explore" is drawn, not a second link.
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows the blurb, the location and the way in", () => {
    renderCard();

    expect(
      screen.getByText("Objetos simples, hechos para acompañarte por años."),
    ).toBeInTheDocument();
    expect(screen.getByText("Ñuñoa")).toBeInTheDocument();
    expect(screen.getByText("Explorar tienda")).toBeInTheDocument();
  });

  it("counts what the business lists, agreeing in number", () => {
    const { rerender } = renderCard({ count: 2 });
    expect(screen.getByText("2 productos")).toBeInTheDocument();

    rerender(
      <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
        <BusinessCard
          href="/es/seller/p1"
          itemType="PROVIDER"
          countKind="services"
          name="Taller Vuelta"
          count={1}
        />
      </DictionaryProvider>,
    );
    expect(screen.getByText("1 servicio")).toBeInTheDocument();
    expect(screen.getByText("Ver proveedor")).toBeInTheDocument();
  });

  it("claims no count when the source has none", () => {
    renderCard({ count: undefined });

    expect(screen.queryByText(/productos?$/)).not.toBeInTheDocument();
  });

  it("labels a known tag and ignores one it has no copy for", () => {
    const { unmount } = renderCard({ tagId: "handmade" });
    expect(screen.getByText("Hecho a mano")).toBeInTheDocument();
    unmount();

    renderCard({ tagId: "notInTheCatalogYet" });
    expect(screen.queryByText(/businessTag\./)).not.toBeInTheDocument();
  });

  it("falls back to initials and a placeholder name", () => {
    renderCard({ name: "", logo: null });

    expect(screen.getByRole("link", { name: "Tienda sin nombre" })).toBeInTheDocument();
    // First letters of the first two words.
    expect(screen.getByText("TS")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderCard({ count: 3, tagId: "zeroWaste", isVerified: true });

    expect((await axe(container)).violations).toEqual([]);
  });
});
