"use client";
import clsx from "clsx";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { TextArea } from "@/components/Primitives/TextArea";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { type BusinessType, type SellerType } from "@/types/enums";
import { isMinLength, isValidEmail } from "@/utils/inputValidations";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Home,
  Lock,
  Mail,
  MailCheck,
  Rocket,
  User,
  type LucideIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  APPLICATION_MESSAGE_MAX,
  APPLICATION_MESSAGE_MIN,
  useRegister,
} from "../hooks/useRegister";

const TOTAL_STEPS = 3;

const ACCOUNT_TYPES: { value: SellerType; icon: LucideIcon; descKey: string }[] = [
  { value: "PERSON", icon: User, descKey: "register.personDesc" },
  { value: "STARTUP", icon: Rocket, descKey: "register.startupDesc" },
  { value: "COMPANY", icon: Building2, descKey: "register.companyDesc" },
];

const BUSINESS_TYPES: BusinessType[] = ["RETAIL", "SERVICES", "MIXED"];

export function RegisterForm() {
  const { t } = useTranslation("auth");
  const {
    sellerType,
    handleSellerType,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    businessName,
    setBusinessName,
    displayName,
    setDisplayName,
    businessType,
    setBusinessType,
    applicationMessage,
    setApplicationMessage,
    applicationSentTo,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleRegister,
  } = useRegister();

  const params = useParams<{ lang?: string }>();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Whether the user has attempted to advance/submit the current step, used to
  // reveal validation errors only after a navigation attempt.
  const [submitted, setSubmitted] = useState(false);

  const isBusiness = sellerType !== "PERSON";

  const emailValid = isValidEmail(email);
  const messageLength = applicationMessage.trim().length;
  const messageValid = messageLength >= APPLICATION_MESSAGE_MIN;
  const detailsValid = isBusiness
    ? businessName.trim().length > 0 &&
      displayName.trim().length > 0 &&
      messageValid &&
      emailValid
    : firstName.trim().length > 0 && lastName.trim().length > 0 && emailValid;
  const passwordValid = isMinLength(password, 8);
  const confirmValid = confirmPassword.length > 0 && password === confirmPassword;

  const goTo = (next: number, dir: "forward" | "back") => {
    setDirection(dir);
    setSubmitted(false);
    setStep(next);
  };

  const handleBack = () => goTo(step - 1, "back");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Steps before the last one advance the wizard instead of submitting.
    if (step < TOTAL_STEPS - 1) {
      if (step === 1 && !detailsValid) {
        setSubmitted(true);
        return;
      }
      goTo(step + 1, "forward");
      return;
    }

    if (!passwordValid || !confirmValid) {
      setSubmitted(true);
      return;
    }

    setSubmitted(false);
    await handleRegister();
  };

  const stepHeader = {
    0: {
      title: t("register.accountTypeTitle"),
      subtitle: t("register.accountTypeSubtitle"),
    },
    1: { title: t("register.detailsTitle"), subtitle: t("register.detailsSubtitle") },
    2: { title: t("register.securityTitle"), subtitle: t("register.securitySubtitle") },
  }[step]!;

  // A business application waits for EKORU's review before the account can
  // sign in, so the wizard ends here instead of on the login page.
  if (applicationSentTo) {
    return (
      <div className="flex flex-col items-center gap-5 py-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary-dark/50 bg-linear-180 from-secondary-hover/15 to-secondary/5 text-secondary-dark">
          <MailCheck size={28} color="currentColor" strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-2">
          <Title level="h2" size="h4" weight="semibold" color="primary" align="center">
            {t("register.applicationSentTitle")}
          </Title>
          <Text variant="span" color="secondary" align="center">
            {t("register.applicationSentBody", { email: applicationSentTo })}
          </Text>
        </div>
        <LinkButton
          href={`/${params.lang ?? "es"}`}
          icon={Home}
          label={t("register.applicationSentAction")}
          variant="primary"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-primary" : "bg-border-light",
              )}
            />
          ))}
        </div>
        <Text variant="small" color="tertiary">
          {t("register.step", {
            current: String(step + 1),
            total: String(TOTAL_STEPS),
          })}
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div
          key={step}
          className={`sm:min-h-79 ${
            direction === "forward" ? "animate-step-forward" : "animate-step-back"
          }`}
        >
          <div className="mb-5 flex flex-col gap-1">
            <Title level="h2" size="h4" weight="semibold" color="primary">
              {stepHeader.title}
            </Title>
            <Text variant="span" color="secondary">
              {stepHeader.subtitle}
            </Text>
          </div>

          {/* Step 1 — Account type */}
          {step === 0 && (
            <div className="flex flex-col gap-3">
              {ACCOUNT_TYPES.map(({ value, icon: Icon, descKey }) => {
                const selected = sellerType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSellerType(value)}
                    aria-pressed={selected}
                    className={clsx(
                      "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                      selected
                        ? "border-primary bg-primary-light-bg"
                        : "border-input-border bg-surface",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                        selected
                          ? "bg-primary text-white"
                          : "bg-background-tertiary text-foreground-tertiary",
                      )}
                    >
                      <Icon size={20} color="currentColor" strokeWidth={2} />
                    </span>
                    <span className="flex flex-1 flex-col">
                      <Text variant="span" weight="bold">
                        {t(`accountTypes.${value.toLowerCase()}`)}
                      </Text>
                      <Text variant="small" color="tertiary">
                        {t(descKey)}
                      </Text>
                    </span>
                    <span
                      className={clsx(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                        selected
                          ? "border-primary bg-primary"
                          : "border-border-strong bg-transparent",
                      )}
                    >
                      {selected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2 — Details */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {isBusiness ? (
                <>
                  <Input
                    name="businessName"
                    label={t("form.businessName")}
                    placeholder={t("form.businessNamePlaceholder")}
                    value={businessName}
                    onChangeText={setBusinessName}
                    autoComplete="organization"
                    required
                    isInvalid={submitted && businessName.trim().length === 0}
                    errorMessage={t("feedback.registerFieldsRequired")}
                  />
                  <Input
                    name="displayName"
                    label={t("form.displayName")}
                    placeholder={t("form.displayNamePlaceholder")}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoComplete="nickname"
                    required
                    isInvalid={submitted && displayName.trim().length === 0}
                    errorMessage={t("feedback.registerFieldsRequired")}
                  />
                  <div className="flex flex-col gap-2">
                    <Text variant="span" weight="medium" color="secondary">
                      {t("form.businessType")}
                    </Text>
                    <div className="grid grid-cols-3 gap-2">
                      {BUSINESS_TYPES.map((type) => {
                        const selected = businessType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setBusinessType(type)}
                            aria-pressed={selected}
                            className={clsx(
                              "rounded-xl border-2 px-3 py-2.5 text-center transition-all duration-200",
                              selected
                                ? "border-primary bg-primary-light-bg"
                                : "border-input-border bg-surface",
                            )}
                          >
                            <Text
                              variant="small"
                              weight={selected ? "bold" : "normal"}
                              color={selected ? "primary" : "secondary"}
                            >
                              {t(`businessTypes.${type.toLowerCase()}`)}
                            </Text>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <TextArea
                      name="applicationMessage"
                      label={t("form.applicationMessage")}
                      placeholder={t("form.applicationMessagePlaceholder")}
                      value={applicationMessage}
                      onChangeText={setApplicationMessage}
                      rows={5}
                      maxLength={APPLICATION_MESSAGE_MAX}
                      required
                      isInvalid={submitted && !messageValid}
                      errorMessage={t("feedback.applicationMessageTooShort", {
                        min: String(APPLICATION_MESSAGE_MIN),
                      })}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <Text variant="small" color="tertiary">
                        {t("form.applicationMessageHint")}
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
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    label={t("form.firstName")}
                    placeholder={t("form.firstNamePlaceholder")}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoComplete="given-name"
                    required
                    isInvalid={submitted && firstName.trim().length === 0}
                  />
                  <Input
                    name="lastName"
                    label={t("form.lastName")}
                    placeholder={t("form.lastNamePlaceholder")}
                    value={lastName}
                    onChangeText={setLastName}
                    autoComplete="family-name"
                    required
                    isInvalid={submitted && lastName.trim().length === 0}
                  />
                </div>
              )}
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
                isInvalid={(submitted || email.length > 0) && !emailValid}
              />
            </div>
          )}

          {/* Step 3 — Password */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <Input
                name="password"
                label={t("form.password")}
                placeholder="••••••••"
                type="password"
                value={password}
                onChangeText={setPassword}
                leftIcon={Lock}
                autoComplete="new-password"
                required
                errorMessage={t("feedback.passwordError")}
                isInvalid={(submitted || password.length > 0) && !passwordValid}
              />
              <Input
                name="confirmPassword"
                label={t("form.confirmPassword")}
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon={Lock}
                autoComplete="new-password"
                required
                errorMessage={t("feedback.passwordMismatch")}
                isInvalid={(submitted || confirmPassword.length > 0) && !confirmValid}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              text={t("actions.back")}
              variant="outline"
              leftIcon={ArrowLeft}
              type="button"
              onClick={handleBack}
              size="md"
            />
          )}
          <div className="flex-1">
            {step < TOTAL_STEPS - 1 ? (
              <Button
                text={t("actions.continue")}
                rightIcon={ArrowRight}
                type="submit"
                fullWidth
                size="md"
              />
            ) : (
              <Button
                text={t("actions.register")}
                rightIcon={ArrowRight}
                type="submit"
                loading={loading}
                fullWidth
                size="md"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
