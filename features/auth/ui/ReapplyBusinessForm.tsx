"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Lock, Mail, MailCheck } from "lucide-react";
import { isValidEmail } from "@/utils/inputValidations";
import { useReapplyBusiness } from "../hooks/useReapplyBusiness";
import { APPLICATION_MESSAGE_MAX, APPLICATION_MESSAGE_MIN } from "../hooks/useRegister";

export function ReapplyBusinessForm() {
  const { t } = useTranslation("auth");
  const {
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
  } = useReapplyBusiness();

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-4 text-center">
        <MailCheck aria-hidden="true" className="size-10 text-primary" />
        <Text variant="p" weight="bold">
          {t("reapply.sentTitle")}
        </Text>
        <Text variant="p" color="tertiary">
          {t("reapply.sentBody", { email: email.trim().toLowerCase() })}
        </Text>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Text variant="p" color="tertiary">
        {t("reapply.intro")}
      </Text>
      <Input
        name="email"
        label={t("form.email")}
        placeholder={t("form.emailPlaceholder")}
        type="email"
        value={email}
        onChangeText={setEmail}
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
        onChangeText={setPassword}
        leftIcon={Lock}
        autoComplete="current-password"
        required
        errorMessage={t("feedback.fieldsRequired")}
        isInvalid={submitted && !password}
      />
      <div className="flex flex-col gap-1.5">
        <TextArea
          name="applicationMessage"
          label={t("form.applicationMessage")}
          placeholder={t("reapply.messagePlaceholder")}
          value={applicationMessage}
          onChangeText={setApplicationMessage}
          rows={6}
          maxLength={APPLICATION_MESSAGE_MAX}
          required
          isInvalid={submitted && !messageValid}
          errorMessage={t("feedback.applicationMessageTooShort", {
            min: String(APPLICATION_MESSAGE_MIN),
          })}
        />
        <div className="flex items-start justify-between gap-3">
          <Text variant="small" color="tertiary">
            {t("reapply.messageHint")}
          </Text>
          <Text
            variant="small"
            color={messageValid ? "tertiary" : "secondary"}
            className="shrink-0"
          >
            {t("form.applicationMessageCount", {
              count: String(messageLength),
              min: String(APPLICATION_MESSAGE_MIN),
            })}
          </Text>
        </div>
      </div>
      <Button
        text={t("actions.reapply")}
        type="submit"
        loading={loading}
        rightIcon={ArrowRight}
        fullWidth
        size="md"
      />
    </form>
  );
}
