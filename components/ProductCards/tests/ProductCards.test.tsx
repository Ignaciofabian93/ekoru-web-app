import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import en from "../i18n/locales/en.json";
import { NAMESPACE } from "../i18n";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import type { Product, StoreProduct } from "@/types/product";
import useProductCardStore from "../context/ProductCardContext";
import MarketplaceCard from "../MarketplaceCard";
import ProductCard from "../ProductCard";
import ServiceCard from "../ServiceCard";
import type { ServiceCardService, StoreProductCardProduct } from "../types";

vi.mock("@/hooks/useToggleFavorite", () => ({
  useToggleFavorite: () => ({ toggleFavorite: vi.fn() }),
}));
vi.mock("@/hooks/useFormatPrice", () => ({
  useFormatPrice: () => (price: number) => `$${price}`,
}));

const product = (id: number, name: string) =>
  ({
    id,
    name,
    price: 10000,
    images: [],
    condition: "GOOD",
    isExchangeable: true,
    isLiked: false,
    environmentalImpact: {
      totalCo2SavingsKG: 4,
      totalWaterSavingsLT: 120,
      materialBreakdown: [],
    },
    seller: null,
  }) as unknown as Product;

function withDictionary(ui: React.ReactNode) {
  return render(<DictionaryProvider dictionary={{ [NAMESPACE]: en }}>{ui}</DictionaryProvider>);
}

describe("ProductCards", () => {
  it("links the whole card through its title", async () => {
    const { container } = withDictionary(<MarketplaceCard product={product(1, "Bike")} lang="es" />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bike" })).toHaveAttribute("href", "/es/product/1");
    expect((await axe(container)).violations).toEqual([]);
  });

  it("flips only the card you turned, loading its back side on the first flip", async () => {
    const user = userEvent.setup();
    withDictionary(
      <>
        <MarketplaceCard product={product(1, "Bike")} lang="es" />
        <MarketplaceCard product={product(2, "Lamp")} lang="es" />
      </>,
    );
    expect(screen.queryByText(en.impact.saved)).not.toBeInTheDocument();

    const [bike] = screen.getAllByRole("article");
    await user.click(within(bike).getByRole("button", { name: en.actions.showImpact }));

    expect(await within(bike).findByText(en.impact.saved)).toBeInTheDocument();
    expect(screen.getAllByText(en.impact.saved)).toHaveLength(1);
    expect(Object.values(useProductCardStore.getState().flipped)).toEqual([true]);
  });

  it("shows a store offer and sold out state", () => {
    const storeProduct = {
      ...product(3, "Bag"),
      hasOffer: true,
      offerPrice: 7500,
      stock: 0,
      isLowStock: false,
      averageRating: 4.5,
      reviewsNumber: 12,
    } as unknown as StoreProduct;
    withDictionary(<ProductCard product={storeProduct} lang="es" />);

    expect(screen.getByText(en.badges.discount.replace("{{value}}", "25"))).toBeInTheDocument();
    expect(screen.getByText(en.badges.soldOut)).toBeInTheDocument();
    expect(screen.getByText("$7500")).toBeInTheDocument();
    expect(screen.getByText("$10000")).toBeInTheDocument();
  });

  it("prices a service from its base price and flips to its description", async () => {
    const user = userEvent.setup();
    const service: ServiceCardService = {
      id: 4,
      name: "Repairs",
      description: "Bike and lamp repairs.",
      price: 5000,
      duration: 60,
      category: "Repairs",
      providerName: "Taller Vuelta",
      providerLocation: "Ñuñoa",
    };
    withDictionary(<ServiceCard service={service} lang="es" />);

    expect(screen.getByText(en.price.from)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: en.actions.showDetails }));

    expect(await screen.findByText("Bike and lamp repairs.")).toBeInTheDocument();
    expect(screen.getByText("Taller Vuelta")).toBeInTheDocument();
  });

  it("keeps the owner menu out of reach while flipped", async () => {
    const user = userEvent.setup();
    const { container } = withDictionary(
      <MarketplaceCard
        product={product(5, "Chair")}
        lang="es"
        actions={<button type="button">Menu</button>}
      />,
    );
    const owner = () => screen.getByRole("button", { name: "Menu" }).closest("[inert]");

    expect(screen.getByText(en.cta.BROWSE)).toBeInTheDocument();
    expect(owner()).toBeNull();

    await user.click(screen.getByRole("button", { name: en.actions.showImpact }));
    expect(await screen.findByText(en.impact.saved)).toBeInTheDocument();
    expect(owner()).not.toBeNull();
    expect((await axe(container)).violations).toEqual([]);

    await user.click(screen.getByRole("button", { name: en.actions.flipBack }));
    expect(owner()).toBeNull();
  });

  it("warns on low stock and flips a store product to its materials", async () => {
    const user = userEvent.setup();
    const storeProduct: StoreProductCardProduct = {
      id: 6,
      name: "Mug",
      price: 8000,
      stock: 2,
      isLowStock: true,
      materials: [
        { id: 1, materialTypeId: 1, materialType: "CERAMIC", label: "Ceramic", percentage: 90 },
        { id: 2, materialTypeId: 2, materialType: "GLAZE", label: "Glaze", percentage: 10 },
      ],
    };
    withDictionary(<ProductCard product={storeProduct} lang="es" />);

    expect(screen.getByText(en.stock.lowStock.replace("{{value}}", "2"))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: en.actions.showImpact }));

    expect(await screen.findByText("Ceramic")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
  });
});
