"use client";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { UPDATE_PASSWORD } from "@/graphql/auth/profile";
import { Login } from "@/lib/api/auth";
import useAuthStore from "@/store/useAuthStore";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import { NAMESPACE } from "../i18n";

export function useChangePassword() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const email = useAuthStore((s) => s.seller?.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [mutate, { loading }] = useMutation(UPDATE_PASSWORD);

  const currentValid = currentPassword.length > 0;
  const lengthValid = newPassword.length >= 8;
  const matchValid = newPassword.length > 0 && newPassword === confirmPassword;
  const notSameValid =
    newPassword.length === 0 ||
    currentPassword.length === 0 ||
    newPassword !== currentPassword;

  const canSubmit = currentValid && lengthValid && matchValid && notSameValid;

  const handleSave = useCallback(async () => {
    setSubmitted(true);
    if (!canSubmit) return;
    try {
      await mutate({ variables: { currentPassword, newPassword } });
      // A changed password signs every session out, this one included, so
      // anyone else who was in is out (USR-17). Sign in again with the new
      // password to keep this device in.
      const signedIn = email
        ? await Login({ email, password: newPassword }).then(
            () => true,
            () => false,
          )
        : false;
      toast.success(t("changePassword.feedback.success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmitted(false);
      // Without a new session this one ends within minutes: ask for the new
      // password now instead of failing on the next click.
      if (!signedIn) {
        window.location.assign(`/${params.lang ?? DEFAULT_LANGUAGE}/login`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("changePassword.feedback.error"),
      );
    }
  }, [canSubmit, mutate, currentPassword, newPassword, email, params.lang, t, toast]);

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    submitted,
    loading,
    canSubmit,
    currentValid,
    lengthValid,
    matchValid,
    notSameValid,
    handleSave,
  };
}
