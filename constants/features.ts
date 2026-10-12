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
      "The /cart, /cart/checkout and /cart/confirmation routes (blocked in proxy.ts), the navbar cart button, and the order history and sales links in the profile and drawer menus.",
  },
  storePurchase: {
    available: false,
    surfaces:
      "Add-to-cart on the store product page and the quantity stepper on store product cards, which fall back to a browse-only CTA.",
  },
  // On since 2026-10-12 (WEB-5): booked here, paid to the provider on site (D7).
  serviceBooking: {
    available: true,
    surfaces:
      "The 'Book' button and booking dialog on a service, the service card's booking CTA, and the bookings link in the profile menu.",
  },
  serviceQuotes: {
    available: false,
    surfaces:
      "The 'Request a quote' button and quote dialog on a service, the quotes inbox link, 'Pay' on accepted quotes, and /cart/confirmation for their payment return (opened in proxy.ts even while the cart is off).",
  },
};

export const isFeatureEnabled = (key: FeatureKey): boolean => FEATURES[key].available;
