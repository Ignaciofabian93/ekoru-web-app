import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import en from "../i18n/locales/en.json";
import { NAMESPACE, type NavigationSection } from "../i18n";
import type { CatalogTree } from "../types";
import SubHeader from "../Subheader";

vi.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
}));

const MARKETPLACE: CatalogTree = {
  loading: false,
  items: [
    {
      label: "Home",
      route: "/marketplace/home",
      children: [
        {
          label: "Furniture",
          route: "/marketplace/home/furniture",
          children: [{ label: "Chairs", route: "/marketplace/home/furniture/chairs" }],
        },
        { label: "Decor", route: "/marketplace/home/decor" },
      ],
    },
    {
      label: "Fashion",
      route: "/marketplace/fashion",
      children: [
        {
          label: "Shoes",
          route: "/marketplace/fashion/shoes",
          children: [{ label: "Boots", route: "/marketplace/fashion/shoes/boots" }],
        },
      ],
    },
  ],
};

const STORES: CatalogTree = {
  loading: false,
  items: [
    {
      label: "Groceries",
      route: "/stores/groceries",
      children: [{ label: "Bulk", route: "/stores/groceries/bulk" }],
    },
  ],
};

const COMMUNITY: CatalogTree = {
  loading: false,
  items: [{ label: "Events", route: "/community/events" }],
};

const EMPTY: CatalogTree = { loading: false, items: [] };

let catalogs: Record<NavigationSection, CatalogTree>;
const requestedLog: NavigationSection[][] = [];

vi.mock("../hooks/useMegaMenuCatalog", () => ({
  useMegaMenuCatalog: (requested: ReadonlySet<NavigationSection>) => {
    requestedLog.push([...requested]);
    return catalogs;
  },
}));

function renderSubHeader() {
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: en }}>
      <SubHeader />
    </DictionaryProvider>,
  );
}

const button = (name: string) => screen.getByRole("button", { name });
const link = (name: string) => screen.getByRole("link", { name });

describe("SubHeader megamenu", () => {
  beforeEach(() => {
    requestedLog.length = 0;
    catalogs = {
      marketplace: MARKETPLACE,
      stores: STORES,
      services: EMPTY,
      community: COMMUNITY,
      blog: { loading: true, items: [] },
    };
  });

  it("keeps a plain link per section for small screens", () => {
    renderSubHeader();

    expect(link("Marketplace")).toHaveAttribute("href", "/en/marketplace");
  });

  it("opens with the top layer only", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Marketplace"));

    expect(button("Marketplace")).toHaveAttribute("aria-expanded", "true");
    expect(link("See all in Marketplace")).toHaveAttribute("href", "/en/marketplace");
    expect(button("Home")).toHaveAttribute("aria-expanded", "false");
    expect(button("Fashion")).toBeInTheDocument();
    expect(screen.queryByText("Furniture")).toBeNull();
  });

  it("opens one layer per click: department, category, subcategory", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Marketplace"));
    await user.click(button("Home"));

    expect(button("Home")).toHaveAttribute("aria-expanded", "true");
    expect(link("See all in Home")).toHaveAttribute("href", "/en/marketplace/home");
    // Childless entries link straight to their page.
    expect(link("Decor")).toHaveAttribute("href", "/en/marketplace/home/decor");
    expect(screen.queryByText("Chairs")).toBeNull();

    await user.click(button("Furniture"));

    expect(link("See all in Furniture")).toHaveAttribute(
      "href",
      "/en/marketplace/home/furniture",
    );
    expect(link("Chairs")).toHaveAttribute("href", "/en/marketplace/home/furniture/chairs");
  });

  it("swaps the deeper layers when another entry is opened", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Marketplace"));
    await user.click(button("Home"));
    await user.click(button("Furniture"));
    await user.click(button("Fashion"));

    expect(button("Home")).toHaveAttribute("aria-expanded", "false");
    expect(button("Shoes")).toBeInTheDocument();
    expect(screen.queryByText("Furniture")).toBeNull();
    expect(screen.queryByText("Chairs")).toBeNull();
  });

  it("closes an entry's layers on a second click", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Marketplace"));
    await user.click(button("Home"));
    await user.click(button("Home"));

    expect(button("Home")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Furniture")).toBeNull();
  });

  it("applies the same layers to two-level sections", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Stores"));
    await user.click(button("Groceries"));

    expect(link("Bulk")).toHaveAttribute("href", "/en/stores/groceries/bulk");
  });

  it("moves between layers with the arrow keys", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Marketplace"));
    button("Home").focus();

    await user.keyboard("{ArrowDown}");
    expect(button("Fashion")).toHaveFocus();

    await user.keyboard("{ArrowUp}{ArrowRight}");
    expect(button("Home")).toHaveAttribute("aria-expanded", "true");
    expect(button("Furniture")).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(button("Home")).toHaveFocus();
  });

  it("switches sections and closes on a second click of the pill", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Stores"));
    await user.click(button("Marketplace"));

    expect(button("Stores")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Groceries")).toBeNull();

    await user.click(button("Marketplace"));

    expect(button("Marketplace")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Home")).toBeNull();
  });

  it("closes on Escape and hands focus back to the pill", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Stores"));
    await user.tab();
    expect(link("See all in Stores")).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(button("Stores")).toHaveAttribute("aria-expanded", "false");
    expect(button("Stores")).toHaveFocus();
  });

  it("closes once a link in the panel is followed", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Community"));
    await user.click(link("Events"));

    expect(button("Community")).toHaveAttribute("aria-expanded", "false");
  });

  it("says when a catalog is loading or empty", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    await user.click(button("Blog"));
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");

    await user.click(button("Services"));
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("requests a catalog only once its pill is hovered, focused or clicked", async () => {
    const user = userEvent.setup();
    renderSubHeader();

    expect(requestedLog.at(-1)).toEqual([]);

    await user.hover(button("Community"));

    expect(requestedLog.at(-1)).toEqual(["community"]);
  });

  it("has no axe violations with every layer open", async () => {
    const user = userEvent.setup();
    const { container } = renderSubHeader();

    await user.click(button("Marketplace"));
    await user.click(button("Home"));
    await user.click(button("Furniture"));

    expect((await axe(container)).violations).toEqual([]);
  });
});
