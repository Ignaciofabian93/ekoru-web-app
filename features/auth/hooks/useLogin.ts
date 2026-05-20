"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useLazyQuery } from "@apollo/client/react";
import { Login } from "@/lib/api/auth";
import { GET_ME } from "@/graphql/auth/login";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useNavigation } from "@/hooks/useNavigation";
import useAuthStore from "@/store/useAuthStore";
import type { Seller } from "@/types/user";

export function useLogin() {
  const { replace, refresh } = useNavigation();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const searchParams = useSearchParams();
  const setSeller = useAuthStore((s) => s.setSeller);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fetchMe] = useLazyQuery<{ me: Seller }>(GET_ME, {
    fetchPolicy: "network-only",
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await Login({ email, password });
      const { data } = await fetchMe();
      if (data?.me) setSeller(data.me);
      const lang = params.lang ?? DEFAULT_LANGUAGE;
      const redirectTo = searchParams.get("redirectTo") ?? `/${lang}/profile`;
      replace({ route: redirectTo });
      refresh();
    } catch (err) {
      const message = isAxiosError(err)
        ? ((err.response?.data as { message?: string } | undefined)?.message ??
          err.message)
        : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
}
