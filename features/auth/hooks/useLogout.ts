"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Logout } from "@/lib/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";

export function useLogout() {
  const router = useRouter();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const clearSeller = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      // Best-effort: even if the server call fails (network, already expired),
      // we still drop local state and route to login so the user isn't stuck.
      await Logout().catch(() => undefined);
    } finally {
      clearSeller();
      const lang = params.lang ?? DEFAULT_LANGUAGE;
      router.push(`/${lang}/login`);
      router.refresh();
      setLoading(false);
    }
  }, [clearSeller, params.lang, router]);

  return { handleLogout, loading };
}
