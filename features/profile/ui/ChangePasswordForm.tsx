"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { Check, KeyRound, Lock, Save, ShieldCheck } from "lucide-react";
import { useChangePassword } from "../hooks/useChangePassword";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "@/components/Patterns/SectionCard";

export function ChangePasswordForm() {
  const { t } = useTranslation(NAMESPACE);
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    submitted,
    loading,
    currentValid,
    lengthValid,
    matchValid,
    notSameValid,
    handleSave,
  } = useChangePassword();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  const tips = [
    { key: "length", check: lengthValid, label: t("changePassword.tips.length") },
    {
      key: "mix",
      check: /[^A-Za-z0-9]/.test(newPassword) || /\d/.test(newPassword),
      label: t("changePassword.tips.mix"),
    },
    {
      key: "unique",
      check: notSameValid && newPassword.length > 0,
      label: t("changePassword.tips.unique"),
    },
  ];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <SectionCard
        icon={KeyRound}
        title={t("changePassword.screenTitle")}
        subtitle={t("changePassword.screenSubtitle")}
      >
        <div className="flex flex-col gap-7">
          <Input
            label={t("changePassword.currentPassword")}
            placeholder={t("changePassword.currentPasswordPlaceholder")}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            type="password"
            leftIcon={Lock}
            autoComplete="current-password"
            isInvalid={submitted && !currentValid}
            errorMessage={t("changePassword.feedback.required")}
          />
          <Input
            label={t("changePassword.newPassword")}
            placeholder={t("changePassword.newPasswordPlaceholder")}
            value={newPassword}
            onChangeText={setNewPassword}
            type="password"
            leftIcon={Lock}
            autoComplete="new-password"
            isInvalid={submitted && !lengthValid}
            errorMessage={t("changePassword.feedback.tooShort")}
          />
          <Input
            label={t("changePassword.confirmPassword")}
            placeholder={t("changePassword.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            type="password"
            leftIcon={Lock}
            autoComplete="new-password"
            isInvalid={submitted && !matchValid}
            errorMessage={t("changePassword.feedback.mismatch")}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={ShieldCheck}
        tone="success"
        title={t("changePassword.tips.title")}
        subtitle={t("changePassword.tips.subtitle")}
      >
        <ul className="flex flex-col gap-2.5">
          {tips.map((tip) => (
            <li key={tip.key} className="flex items-start gap-2.5">
              <span
                className={
                  tip.check
                    ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
                    : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-border-strong text-foreground-tertiary"
                }
              >
                <Check size={12} color="currentColor" strokeWidth={3} />
              </span>
              <Text
                variant="span"
                size="sm"
                color={tip.check ? "default" : "secondary"}
                className="flex-1"
              >
                {tip.label}
              </Text>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="w-full max-w-6xl mt-12 mx-auto">
        <Button
          text={
            loading
              ? t("changePassword.actions.saving")
              : t("changePassword.actions.save")
          }
          leftIcon={Save}
          loading={loading}
          type="submit"
          fullWidth
          size="md"
        />
      </div>
    </form>
  );
}
