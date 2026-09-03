"use client";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { useApolloClient } from "@apollo/client/react";
import { Logout } from "@/lib/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import useCartStore from "@/store/useCartStore";

export function useLogout() {
  const params = useParams<{ lang?: SupportedLanguage }>();
  const clearSeller = useAuthStore((s) => s.logout);
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const clearCart = useCartStore((s) => s.clear);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      // Best-effort: even if the server call fails (network, already expired),
      // we still drop local state and route home so the user isn't stuck.
      await Logout().catch(() => undefined);
    } finally {
      clearSeller();
      clearCart();
      // Wipe the authenticated cache so the anonymous view is fresh — otherwise
      // viewer-scoped lists cached for the just-logged-out seller (e.g. the
      // marketplace grid that excluded their own products) would linger.
      await client.clearStore().catch(() => undefined);

      const lang = params.lang ?? DEFAULT_LANGUAGE;

      // A full document load rather than `router.push` + `router.refresh()`.
      // Logout is almost always triggered from a protected route (`/profile`,
      // `/settings`), and `refresh()` re-fetches the route you are *still* on
      // while the push is in flight — by then the session cookies are gone, so
      // `proxy.ts` answered that refresh with a redirect to `/login` and the
      // user landed there instead of home. Leaving the document entirely also
      // drops the router cache, which holds the signed-in render of every page
      // already visited.
      window.location.assign(`/${lang}`);
    }
  }, [clearSeller, client, params.lang, clearCart]);

  return { handleLogout, loading };
}
