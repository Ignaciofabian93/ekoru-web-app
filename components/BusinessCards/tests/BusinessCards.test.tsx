import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import type { Seller } from "@/types/user";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import ServiceProviderCard from "../ServiceProviderCard";
import StoreCard from "../StoreCard";

const seller = (profile: Record<string, unknown> = {}, extra: Partial<Seller> = {}) =>
  ({
    id: "s1",
    isVerified: false,
    county: { county: "Ñuñoa" },
    profile: {
      __typename: "BusinessProfile",
      businessName: "Brote Estudio",
      description: "Objetos simples, hechos para acompañarte por años.",
      logo: null,
      coverImage: null,
      tags: [],
      ...profile,
    },
    ...extra,
  }) as unknown as Seller;

function withDictionary(ui: React.ReactNode) {
  return render(<DictionaryProvider dictionary={{ [NAMESPACE]: es }}>{ui}</DictionaryProvider>);
}

describe("BusinessCards", () => {
  it("is one link to the business, named for it", () => {
    withDictionary(<StoreCard store={seller()} lang="es" />);

    expect(screen.getByRole("link", { name: "Brote Estudio" })).toHaveAttribute(
      "href",
      "/es/seller/s1",
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows the blurb, the location and the way in", () => {
    withDictionary(<StoreCard store={seller()} lang="es" />);

    expect(
      screen.getByText("Objetos simples, hechos para acompañarte por años."),
    ).toBeInTheDocument();
    expect(screen.getByText("Ñuñoa")).toBeInTheDocument();
    expect(screen.getByText("Explorar tienda")).toBeInTheDocument();
  });

  it("counts what the business lists, agreeing in number", () => {
    const { unmount } = withDictionary(<StoreCard store={seller()} lang="es" productCount={2} />);
    expect(screen.getByText("2 productos")).toBeInTheDocument();
    unmount();

    withDictionary(
      <ServiceProviderCard
        provider={seller({ businessName: "Taller Vuelta" }, { id: "p1" })}
        lang="es"
        serviceCount={1}
      />,
    );
    expect(screen.getByText("1 servicio")).toBeInTheDocument();
    expect(screen.getByText("Ver proveedor")).toBeInTheDocument();
  });

  it("claims no count when the source has none", () => {
    withDictionary(<StoreCard store={seller()} lang="es" />);

    expect(screen.queryByText(/productos?$/)).not.toBeInTheDocument();
  });

  it("labels a known tag and ignores one it has no copy for", () => {
    const { unmount } = withDictionary(
      <StoreCard store={seller({ tags: ["handmade"] })} lang="es" />,
    );
    expect(screen.getByText("Hecho a mano")).toBeInTheDocument();
    unmount();

    withDictionary(<StoreCard store={seller({ tags: ["notInTheCatalogYet"] })} lang="es" />);
    expect(screen.queryByText(/businessTag\./)).not.toBeInTheDocument();
  });

  it("falls back to initials and a placeholder name", () => {
    withDictionary(<StoreCard store={seller({ businessName: "" })} lang="es" />);

    expect(screen.getByRole("link", { name: "Tienda sin nombre" })).toBeInTheDocument();
    expect(screen.getByText("TS")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = withDictionary(
      <StoreCard
        store={seller({ tags: ["zeroWaste"] }, { isVerified: true })}
        lang="es"
        productCount={3}
      />,
    );

    expect((await axe(container)).violations).toEqual([]);
  });
});
