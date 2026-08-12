"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { isMinLength, isValidEmail } from "@/utils/inputValidations";

export function LoginForm() {
  const { t } = useTranslation("auth");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
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
      <Link
        href={`/${lang}/forgot-password`}
        className="-mt-2 self-end text-sm font-semibold text-primary hover:underline"
      >
        {t("actions.forgotPassword")}
      </Link>
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
