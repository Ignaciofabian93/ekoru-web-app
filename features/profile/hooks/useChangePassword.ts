"use client";
import { useCallback, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PASSWORD } from "@/graphql/auth/profile";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import { NAMESPACE } from "../i18n";

export function useChangePassword() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [mutate, { loading }] = useMutation(UPDATE_PASSWORD);

  const currentValid = currentPassword.length > 0;
  const lengthValid = newPassword.length >= 8;
  const matchValid = newPassword.length > 0 && newPassword === confirmPassword;
  const notSameValid =
    newPassword.length === 0 || currentPassword.length === 0 || newPassword !== currentPassword;

  const canSubmit = currentValid && lengthValid && matchValid && notSameValid;

  const handleSave = useCallback(async () => {
    setSubmitted(true);
    if (!canSubmit) return;
    try {
      await mutate({ variables: { currentPassword, newPassword } });
      toast.success(t("changePassword.feedback.success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmitted(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("changePassword.feedback.error"));
    }
  }, [canSubmit, mutate, currentPassword, newPassword, t, toast]);

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
