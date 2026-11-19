import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";
import {
  ExploreLocationSeedProvider,
  type ExploreLocationSeed,
} from "@/context/ExploreLocationContext";
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
    exchange: [] as Item[],
    stores: [] as Item[],
    storeProducts: [] as Item[],
    services: [] as Item[],
  },
  detect: vi.fn(),
  warning: vi.fn(),
}));

vi.mock("../hooks/useNearbyCounties", () => ({
  useNearbyCounties: (args: { radiusKm: number; location: unknown }) => {
    state.nearbyCalls.push(args);
    return { ...state.nearby, loading: false };
  },
}));
vi.mock("../hooks/useMarketplaceProducts", () => ({
  useNearbyMarketplaceProducts: ({ isExchangeable }: { isExchangeable: boolean }) => ({
    products: isExchangeable ? state.rails.exchange : state.rails.marketplace,
    loading: false,
  }),
}));
vi.mock("../hooks/useStores", () => ({
  useStoresHomeData: () => ({
    sellers: state.rails.stores,
    productCounts: {},
    loading: false,
  }),
}));
vi.mock("../hooks/useStoreProducts", () => ({
  useStoreProductsHomeData: () => ({
    storeProducts: state.rails.storeProducts,
    loading: false,
  }),
}));
vi.mock("../hooks/useServices", () => ({
  useServicesHomeData: () => ({
    sellers: state.rails.services,
    serviceCounts: {},
    loading: false,
  }),
}));
vi.mock("@/components/Navigation/hooks/useComunaDetection", async (importOriginal) => ({
  // Keeps the real locationStatusMessage.
  ...(await importOriginal<Record<string, unknown>>()),
  useComunaDetection: () => ({ status: "idle", detect: state.detect }),
}));
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ warning: state.warning }),
}));
vi.mock("@/components/ProductCards", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  MarketplaceCard: ({ product }: { product: Item }) => <article>{product.name}</article>,
  ProductCard: ({ product }: { product: Item }) => <article>{product.name}</article>,
}));
vi.mock("@/components/BusinessCards", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  StoreCard: ({ store }: { store: Item }) => <article>{store.name}</article>,
  ServiceProviderCard: ({ provider }: { provider: Item }) => (
    <article>{provider.name}</article>
  ),
}));

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
  state.rails = {
    marketplace: [],
    exchange: [],
    stores: [],
    storeProducts: [],
    services: [],
  };
  state.detect.mockReset();
  state.warning.mockReset();
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
    // Location only: no comuna to pick by hand.
    expect(screen.queryByRole("button", { name: /district/i })).not.toBeInTheDocument();
  });

  it("splits nearby marketplace items into for-sale and open-to-swap rails", () => {
    withLocation();
    state.rails.marketplace = [{ id: 1, name: "Bike" }];
    state.rails.exchange = [{ id: 4, name: "Camera" }];
    renderSection();

    const rail = (name: string) =>
      within(screen.getByRole("heading", { level: 3, name }).parentElement!);
    expect(rail("Second-hand for sale").getByText("Bike")).toBeInTheDocument();
    expect(rail("Second-hand for sale").queryByText("Camera")).not.toBeInTheDocument();
    expect(rail("Open to swaps").getByText("Camera")).toBeInTheDocument();
    expect(rail("Open to swaps").queryByText("Bike")).not.toBeInTheDocument();
  });

  it("shows what is within the default radius of the chosen comuna", async () => {
    withLocation();
    state.rails.marketplace = [{ id: 1, name: "Bike" }];
    state.rails.exchange = [{ id: 4, name: "Camera" }];
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

  it("re-detects the location from the update link", async () => {
    const user = userEvent.setup();
    withLocation();
    state.rails.stores = [{ id: 2, name: "Zero Waste Shop" }];
    state.detect.mockResolvedValue("detected");
    renderSection();

    await user.click(screen.getByRole("button", { name: "Update location" }));
    expect(state.detect).toHaveBeenCalledTimes(1);
    expect(state.warning).not.toHaveBeenCalled();
  });

  it("explains a refused permission in a toast", async () => {
    const user = userEvent.setup();
    withLocation();
    state.rails.stores = [{ id: 2, name: "Zero Waste Shop" }];
    state.detect.mockResolvedValue("denied");
    renderSection();

    await user.click(screen.getByRole("button", { name: "Update location" }));
    expect(state.warning).toHaveBeenCalledWith(
      navigationEn.location.status.denied,
      expect.objectContaining({ toastId: "explore-location" }),
    );
  });
});

/**
 * The server's HTML, parsed: `renderToString` renders from the seed the page
 * read from the request, never from `document.cookie`.
 */
function renderOnServer(seed?: ExploreLocationSeed) {
  const section = (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: en, [NAVIGATION_NAMESPACE]: navigationEn }}
    >
      <NearbySection lang="en" />
    </DictionaryProvider>
  );
  const container = document.body.appendChild(document.createElement("div"));
  onTestFinished(() => container.remove());
  container.innerHTML = renderToString(
    seed ? (
      <ExploreLocationSeedProvider seed={seed}>{section}</ExploreLocationSeedProvider>
    ) : (
      section
    ),
  );
  return within(container);
}

describe("NearbySection's first HTML", () => {
  it("already holds a returning visitor's rails, so nothing grows in after hydration", () => {
    // What the server knows: the comuna, not yet the comunas around it.
    state.nearby = { hasOrigin: true, countyIds: undefined, error: undefined };
    const html = renderOnServer({
      location: { county: "Ñuñoa", countyId: 10, source: "manual" },
      radius: 25,
    });

    expect(html.getByRole("heading", { level: 2, name: "Near you" })).toBeInTheDocument();
    expect(html.getByText(/What's within 25 km of Ñuñoa\./)).toBeInTheDocument();
    expect(html.getByRole("radio", { name: "25 km" })).toBeChecked();
    expect(
      html.getByRole("heading", { level: 3, name: "Second-hand for sale" }),
    ).toBeInTheDocument();
    expect(html.queryByText("Discover what's near you")).not.toBeInTheDocument();
  });

  it("asks a new visitor for their location", () => {
    const html = renderOnServer({ location: null, radius: 10 });

    expect(
      html.getByRole("heading", { name: "Discover what's near you" }),
    ).toBeInTheDocument();
  });

  it("asks for the location when the page didn't read the cookie", () => {
    // A comuna in the browser's cookie is invisible to the server.
    withLocation();
    const html = renderOnServer();

    expect(
      html.getByRole("heading", { name: "Discover what's near you" }),
    ).toBeInTheDocument();
  });
});
