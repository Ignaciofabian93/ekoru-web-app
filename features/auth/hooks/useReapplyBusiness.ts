"use client";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { REAPPLY_BUSINESS } from "@/graphql/auth/profile";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import { isValidEmail } from "@/utils/inputValidations";
import { APPLICATION_MESSAGE_MIN } from "./useRegister";

/**
 * A business EKORU rejected sends a new application (USR-5). It cannot sign in
 * until it is approved, so it proves who it is with its email and password.
 * Wrong credentials count toward the same lock as the login.
 */
export function useReapplyBusiness() {
  const { t } = useTranslation("auth");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [reapply, { loading }] = useMutation(REAPPLY_BUSINESS);

  const messageLength = applicationMessage.trim().length;
  const messageValid = messageLength >= APPLICATION_MESSAGE_MIN;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const address = email.trim().toLowerCase();
    if (!isValidEmail(address)) {
      toast.error(t("feedback.emailError"));
      return;
    }
    if (!password) {
      toast.error(t("feedback.fieldsRequired"));
      return;
    }
    if (!messageValid) {
      toast.error(
        t("feedback.applicationMessageTooShort", {
          min: String(APPLICATION_MESSAGE_MIN),
        }),
      );
      return;
    }

    try {
      await reapply({
        variables: {
          input: {
            email: address,
            password,
            applicationMessage: applicationMessage.trim(),
          },
          language: (params.lang ?? DEFAULT_LANGUAGE).toUpperCase(),
        },
      });
      setPassword("");
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("feedback.networkError"));
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    applicationMessage,
    setApplicationMessage,
    messageLength,
    messageValid,
    submitted,
    sent,
    loading,
    handleSubmit,
  };
}
