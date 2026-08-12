"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Lock } from "lucide-react";
import { useResetPassword } from "../hooks/useResetPassword";
import { isMinLength } from "@/utils/inputValidations";

export function ResetPasswordForm() {
  const { t } = useTranslation("auth");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const {
    token,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  } = useResetPassword();

  // Reached without the emailed token — a truncated copy/paste, or someone
  // opening the route directly. Nothing to submit, so send them back a step.
  if (!token) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-4 text-center">
        <Text variant="p" weight="bold">
          {t("resetPassword.missingTokenTitle")}
        </Text>
        <Text variant="p" color="tertiary">
          {t("resetPassword.missingToken")}
        </Text>
        <Link
          href={`/${lang}/forgot-password`}
          className="font-bold text-primary hover:underline"
        >
          {t("actions.sendResetLink")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Text variant="p" color="tertiary">
        {t("resetPassword.intro")}
      </Text>
      <Input
        name="newPassword"
        label={t("form.newPassword")}
        placeholder="••••••••"
        type="password"
        value={password}
        onChangeText={(e) => setPassword(e)}
        leftIcon={Lock}
        autoComplete="new-password"
        required
        errorMessage={t("feedback.passwordError")}
        isInvalid={password.length > 0 && !isMinLength(password, 8)}
      />
      <Input
        name="confirmPassword"
        label={t("form.confirmPassword")}
        placeholder="••••••••"
        type="password"
        value={confirmPassword}
        onChangeText={(e) => setConfirmPassword(e)}
        leftIcon={Lock}
        autoComplete="new-password"
        required
        errorMessage={t("feedback.confirmPasswordError")}
        isInvalid={confirmPassword.length > 0 && confirmPassword !== password}
      />
      <Button
        text={t("actions.updatePassword")}
        type="submit"
        loading={loading}
        rightIcon={ArrowRight}
        fullWidth
        size="md"
      />
    </form>
  );
}
