import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import navigationEn from "@/components/Navigation/i18n/locales/en.json";
import { NAMESPACE as NAVIGATION_NAMESPACE } from "@/components/Navigation/i18n";
import { EXPLORE_LOCATION_COOKIE, EXPLORE_RADIUS_COOKIE } from "@/constants/settings";
import en from "../i18n/locales/en.json";
import { NAMESPACE } from "../i18n";
import { NearbySection } from "../ui/NearbySection";

type Item = { id: number; name: string };

// jsdom has no ResizeObserver; the card rails only use it to toggle arrows.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const state = vi.hoisted(() => ({
  nearby: {
    hasOrigin: false,
    countyIds: undefined as number[] | undefined,
    error: undefined as Error | undefined,
  },
  nearbyCalls: [] as { radiusKm: number; location: unknown }[],
  rails: {
    marketplace: [] as Item[],
    stores: [] as Item[],
    storeProducts: [] as Item[],
    services: [] as Item[],
  },
  detect: vi.fn(),
}));

vi.mock("../hooks/useNearbyCounties", () => ({
  useNearbyCounties: (args: { radiusKm: number; location: unknown }) => {
    state.nearbyCalls.push(args);
    return { ...state.nearby, loading: false };
  },
}));
vi.mock("../hooks/useMarketplaceProducts", () => ({
  useNearbyMarketplaceProducts: () => ({
    products: state.rails.marketplace,
    loading: false,
  }),
}));
vi.mock("../hooks/useStores", () => ({
  useStoresHomeData: () => ({ sellers: state.rails.stores, loading: false }),
}));
vi.mock("../hooks/useStoreProducts", () => ({
  useStoreProductsHomeData: () => ({
    storeProducts: state.rails.storeProducts,
    loading: false,
  }),
}));
vi.mock("../hooks/useServices", () => ({
  useServicesHomeData: () => ({ sellers: state.rails.services, loading: false }),
}));
vi.mock("@/components/Navigation/hooks/useComunaDetection", () => ({
  useComunaDetection: () => ({ status: "idle", detect: state.detect }),
}));
// The real dialog loads the region → comuna cascade over Apollo.
vi.mock("@/components/Navigation/LocationDialog", () => ({
  LocationDialog: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div role="dialog" aria-label="Where are you exploring from?" /> : null,
  locationStatusMessage: () => "",
}));
vi.mock("@/components/Cards", () => {
  const Card = ({ name }: { name: string }) => <article>{name}</article>;
  return {
    MarketplaceCard: ({ product }: { product: Item }) => <Card name={product.name} />,
    StoreProductCard: ({ product }: { product: Item }) => <Card name={product.name} />,
    StoresCard: ({ store }: { store: Item }) => <Card name={store.name} />,
    ServiceProviderCard: ({ provider }: { provider: Item }) => (
      <Card name={provider.name} />
    ),
  };
});

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value};path=/`;
};
const clearCookie = (name: string) => {
  document.cookie = `${name}=;path=/;max-age=0`;
};

function renderSection() {
  return render(
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: en, [NAVIGATION_NAMESPACE]: navigationEn }}
    >
      <NearbySection lang="en" />
    </DictionaryProvider>,
  );
}

beforeEach(() => {
  clearCookie(EXPLORE_LOCATION_COOKIE);
  clearCookie(EXPLORE_RADIUS_COOKIE);
  state.nearby = { hasOrigin: false, countyIds: undefined, error: undefined };
  state.nearbyCalls.length = 0;
  state.rails = { marketplace: [], stores: [], storeProducts: [], services: [] };
  state.detect.mockReset();
});

function withLocation() {
  setCookie(
    EXPLORE_LOCATION_COOKIE,
    encodeURIComponent(
      JSON.stringify({ county: "Ñuñoa", countyId: 10, source: "manual" }),
    ),
  );
  state.nearby = { hasOrigin: true, countyIds: [10, 11], error: undefined };
}

describe("NearbySection", () => {
  it("asks for a location when there is none", async () => {
    const user = userEvent.setup();
    renderSection();

    expect(
      screen.getByRole("heading", { name: "Discover what's near you" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Use my location" }));
    expect(state.detect).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Choose district" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows what is within the default radius of the chosen comuna", async () => {
    withLocation();
    state.rails.marketplace = [{ id: 1, name: "Bike" }];
    state.rails.stores = [{ id: 2, name: "Zero Waste Shop" }];
    const { container } = renderSection();

    expect(
      screen.getByRole("heading", { level: 2, name: "Near you" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/What's within 10 km of Ñuñoa\./)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "10 km" })).toBeChecked();
    expect(screen.getByText("Bike")).toBeInTheDocument();
    expect(screen.getByText("Zero Waste Shop")).toBeInTheDocument();
    // Rails with nothing nearby keep their heading and say so.
    expect(
      screen.getByRole("heading", { level: 3, name: "Services" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Nothing within 10 km yet.")).toHaveLength(2);

    expect((await axe(container)).violations).toEqual([]);
  });

  it("searches again with the radius the visitor picks, and remembers it", async () => {
    const user = userEvent.setup();
    withLocation();
    state.rails.services = [{ id: 3, name: "Bike repair" }];
    renderSection();

    await user.click(screen.getByRole("radio", { name: "25 km" }));

    expect(screen.getByRole("radio", { name: "25 km" })).toBeChecked();
    expect(state.nearbyCalls.at(-1)?.radiusKm).toBe(25);
    expect(document.cookie).toContain(`${EXPLORE_RADIUS_COOKIE}=25`);
  });

  it("offers a wider radius when nothing at all is nearby", async () => {
    const user = userEvent.setup();
    withLocation();
    renderSection();

    expect(screen.getByText("Nothing within 10 km of Ñuñoa yet")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Widen to 25 km" }));

    expect(screen.getByRole("radio", { name: "25 km" })).toBeChecked();
  });

  it("opens the comuna dialog from the change link", async () => {
    const user = userEvent.setup();
    withLocation();
    state.rails.stores = [{ id: 2, name: "Zero Waste Shop" }];
    renderSection();

    await user.click(screen.getByRole("button", { name: "Change district" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
