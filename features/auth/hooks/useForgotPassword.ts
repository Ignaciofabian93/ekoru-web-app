"use client";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { REQUEST_PASSWORD_RESET } from "@/graphql/auth/profile";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import { isValidEmail } from "@/utils/inputValidations";

/**
 * Step one of account recovery: ask for the reset link.
 *
 * `sent` flips on any successful call, including for addresses with no account
 * — the backend answers identically either way on purpose, and the UI must not
 * undo that by reporting "no such user".
 */
export function useForgotPassword() {
  const { t } = useTranslation("auth");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = email.trim().toLowerCase();
    if (!isValidEmail(address)) {
      toast.error(t("feedback.emailError"));
      return;
    }

    try {
      await requestReset({
        variables: {
          email: address,
          language: (params.lang ?? DEFAULT_LANGUAGE).toUpperCase(),
        },
      });
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("feedback.networkError"));
    }
  };

  return { email, setEmail, sent, loading, handleSubmit };
}
