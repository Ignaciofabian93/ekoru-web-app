import { useDrawerBlogs } from "../../Drawer/hooks/useDrawerBlogs";
import { useDrawerCommunity } from "../../Drawer/hooks/useDrawerCommunity";
import { useDrawerMarketplace } from "../../Drawer/hooks/useDrawerMarketplace";
import { useDrawerServices } from "../../Drawer/hooks/useDrawerServices";
import { useDrawerStores } from "../../Drawer/hooks/useDrawerStores";
import type { NavigationSection } from "../i18n";
import type { CatalogTree } from "../types";

/**
 * The catalog tree behind each subheader section, for the desktop megamenu.
 *
 * Reuses the drawer's hooks, so the two menus share one query (and one Apollo
 * cache entry) per catalog. Each query stays skipped until its section is
 * `requested`, which happens on first hover, focus or click of its trigger. The
 * navbar renders on every page, so fetching all five catalogs up front would
 * cost five requests per page load for a menu most visits never open.
 */
export function useMegaMenuCatalog(
  requested: ReadonlySet<NavigationSection>,
): Record<NavigationSection, CatalogTree> {
  return {
    marketplace: useDrawerMarketplace(requested.has("marketplace")),
    stores: useDrawerStores(requested.has("stores")),
    services: useDrawerServices(requested.has("services")),
    community: useDrawerCommunity(requested.has("community")),
    blog: useDrawerBlogs(requested.has("blog")),
  };
}
