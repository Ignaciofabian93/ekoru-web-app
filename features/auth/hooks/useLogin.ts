"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { Login } from "@/lib/api/auth";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";

export function useLogin() {
  const router = useRouter();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await Login({ email, password });
      const lang = params.lang ?? DEFAULT_LANGUAGE;
      const redirectTo = searchParams.get("redirectTo") ?? `/${lang}/profile`;
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          err.message
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
