/**
 * Feature switchboard — the same `available: boolean` pattern the menus use
 * (`components/Drawer/constants/menuItems.ts`,
 * `features/profile/constants/menuItems.ts`), lifted to whole capabilities.
 *
 * Everything the beta ships without transacting is gated here rather than
 * commented out or deleted, so turning a capability on later is one edit in one
 * file: flip `available` to `true` and every surface listed on the flag comes
 * back, wired exactly as it was.
 *
 * Read it directly (`FEATURES.cart.available`) or through
 * {@link isFeatureEnabled}. Plain module constants, so both the server (the
 * proxy blocks the routes) and the client (the UI hides the controls) see the
 * same answer, and a disabled route can't be reached by typing its URL.
 */

export type FeatureKey = "cart" | "storePurchase" | "serviceBooking" | "serviceQuotes";

export type FeatureFlag = {
  /** Flip to `true` to ship the capability. */
  available: boolean;
  /** What comes back on when it flips — keep this list current. */
  surfaces: string;
};

export const FEATURES: Record<FeatureKey, FeatureFlag> = {
  cart: {
    available: false,
    surfaces:
      "The /cart, /cart/checkout and /cart/confirmation routes (blocked in proxy.ts) and the navbar cart button.",
  },
  storePurchase: {
    available: false,
    surfaces:
      "Add-to-cart on the store product page and the quantity stepper on store product cards, which fall back to a browse-only CTA.",
  },
  serviceBooking: {
    available: false,
    surfaces:
      "The 'Book' button and booking dialog on a service, and the service card's booking CTA.",
  },
  serviceQuotes: {
    available: false,
    surfaces: "The 'Request a quote' button and quote dialog on a service.",
  },
};

export const isFeatureEnabled = (key: FeatureKey): boolean => FEATURES[key].available;
