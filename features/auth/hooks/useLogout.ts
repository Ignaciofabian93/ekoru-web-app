"use client";
import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client/react";
import { Logout } from "@/lib/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import useCartStore from "@/store/useCartStore";

export function useLogout() {
  const router = useRouter();
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
      router.push(`/${lang}`);
      router.refresh();
      setLoading(false);
    }
  }, [clearSeller, client, params.lang, router, clearCart]);

  return { handleLogout, loading };
}
