"use client";
import { useMutation } from "@apollo/client/react";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { RESET_PASSWORD } from "@/graphql/auth/profile";
import { useTranslation } from "@/i18n/context";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/useToast";
import { isMinLength } from "@/utils/inputValidations";

/**
 * Step two: set the new password with the token from the emailed link.
 *
 * The backend revokes every refresh token as part of the reset, so there is no
 * session to keep here — the user is sent to /login to sign in fresh.
 */
export function useResetPassword() {
  const { t } = useTranslation("auth");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const searchParams = useSearchParams();
  const { replace } = useNavigation();
  const toast = useToast();

  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMinLength(password, 8)) {
      toast.error(t("feedback.passwordError"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("feedback.passwordMismatch"));
      return;
    }

    try {
      await resetPassword({
        variables: {
          token,
          newPassword: password,
          language: lang.toUpperCase(),
        },
      });
      toast.success(t("feedback.resetSuccess"));
      replace({ route: `/${lang}/login` });
    } catch (err) {
      // Invalid, used and expired links all surface here with the backend's
      // translated message — the three cases are worth telling apart.
      toast.error(err instanceof Error ? err.message : t("feedback.networkError"));
    }
  };

  return {
    token,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  };
}
