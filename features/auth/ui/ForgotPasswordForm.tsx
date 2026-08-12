"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Mail, MailCheck } from "lucide-react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { isValidEmail } from "@/utils/inputValidations";

export function ForgotPasswordForm() {
  const { t } = useTranslation("auth");
  const { email, setEmail, sent, loading, handleSubmit } = useForgotPassword();

  // Deliberately the same confirmation for every address: saying "no account
  // with that email" here would leak which addresses are registered.
  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-4 text-center">
        <MailCheck aria-hidden="true" className="size-10 text-primary" />
        <Text variant="p" weight="bold">
          {t("forgotPassword.sentTitle")}
        </Text>
        <Text variant="p" color="tertiary">
          {t("forgotPassword.sentBody")}
        </Text>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Text variant="p" color="tertiary">
        {t("forgotPassword.intro")}
      </Text>
      <Input
        name="email"
        label={t("form.email")}
        placeholder={t("form.emailPlaceholder")}
        type="email"
        value={email}
        onChangeText={(e) => setEmail(e)}
        leftIcon={Mail}
        autoComplete="email"
        required
        errorMessage={t("feedback.emailError")}
        isInvalid={email.length > 0 && !isValidEmail(email)}
      />
      <Button
        text={t("actions.sendResetLink")}
        type="submit"
        loading={loading}
        rightIcon={ArrowRight}
        fullWidth
        size="md"
      />
    </form>
  );
}
