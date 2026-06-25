"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { useLazyQuery } from "@apollo/client/react";
import { Login } from "@/lib/api/auth";
import { GET_ME } from "@/graphql/auth/login";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/useToast";
import useAuthStore from "@/store/useAuthStore";
import type { Seller } from "@/types/user";

export function useLogin() {
  const { replace, refresh } = useNavigation();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const searchParams = useSearchParams();
  const setSeller = useAuthStore((s) => s.setSeller);
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fetchMe] = useLazyQuery<{ me: Seller }>(GET_ME, {
    fetchPolicy: "network-only",
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Normalize email to match how it was stored on register; otherwise a
      // trailing space or capital letter from mobile autocomplete would cause
      // a 400 / "user not found" on an account that actually exists.
      await Login({ email: email.trim().toLowerCase(), password: password.trim() });
      const { data } = await fetchMe();
      if (data?.me) setSeller(data.me);
      const lang = params.lang ?? DEFAULT_LANGUAGE;
      // Only honor a same-origin relative path to avoid open-redirects.
      const requested = searchParams.get("redirectTo");
      const safeRedirect =
        requested && requested.startsWith("/") && !requested.startsWith("//")
          ? requested
          : `/${lang}/profile`;
      replace({ route: safeRedirect });
      refresh();
    } catch (err) {
      const message = isAxiosError(err)
        ? ((err.response?.data as { message?: string } | undefined)?.message ??
          err.message)
        : "Unexpected error";
      toast.error(message);
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
    handleSubmit,
  };
}
