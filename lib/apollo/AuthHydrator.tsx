"use client";

import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { GET_ME } from "@/graphql/auth/login";
import useAuthStore from "@/store/useAuthStore";
import type { Seller } from "@/types/user";

export default function AuthHydrator() {
  const setSeller = useAuthStore((s) => s.setSeller);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [fetchMe] = useLazyQuery<{ me: Seller }>(GET_ME, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isHydrated) return;
    fetchMe()
      .then(({ data }) => {
        if (data?.me) setSeller(data.me);
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
    // Hydrate auth state once on mount; guarded by isHydrated above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
