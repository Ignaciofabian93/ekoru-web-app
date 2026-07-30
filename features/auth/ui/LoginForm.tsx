"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { isMinLength, isValidEmail } from "@/utils/inputValidations";

export function LoginForm() {
  const { t } = useTranslation("auth");
  const { handleSubmit, email, setEmail, password, setPassword, loading } = useLogin();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
      <Input
        name="password"
        label={t("form.password")}
        placeholder="••••••••"
        type="password"
        value={password}
        onChangeText={(e) => setPassword(e)}
        leftIcon={Lock}
        autoComplete="current-password"
        required
        errorMessage={t("feedback.passwordError")}
        isInvalid={password.length > 0 && !isMinLength(password, 8)}
      />
      <Button
        text={t("actions.login")}
        type="submit"
        loading={loading}
        rightIcon={ArrowRight}
        fullWidth
        size="md"
      />
    </form>
  );
}
