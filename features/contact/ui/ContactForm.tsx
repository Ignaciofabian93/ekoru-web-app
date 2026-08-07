"use client";
import { useMemo } from "react";
import clsx from "clsx";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Select, type Option } from "@/components/Primitives/Select";
import { TextArea } from "@/components/Primitives/TextArea";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import {
  CheckCircle,
  Clock,
  Leaf,
  Mail,
  Send,
  ShieldCheck,
  Tag,
  User,
  Users,
} from "lucide-react";
import { CONTACT_SUBJECTS, type ContactSubject } from "../constants/subjects";
import { useContact } from "../hooks/useContact";
import { NAMESPACE } from "../i18n";

/** Reassurances shown beside the form, in the tinted panel. */
const INFO_ITEMS = [
  { key: "response", icon: Clock },
  { key: "privacy", icon: ShieldCheck },
  { key: "community", icon: Users },
] as const;

export function ContactForm() {
  const { t } = useTranslation(NAMESPACE);
  const {
    name,
    setName,
    email,
    setEmail,
    subject,
    setSubject,
    message,
    setMessage,
    errors,
    clearError,
    loading,
    sent,
    reset,
    liveMessage,
    handleSubmit,
  } = useContact();

  const subjectOptions = useMemo<Option[]>(
    () => CONTACT_SUBJECTS.map((value) => ({ value, label: t(`subjects.${value}`) })),
    [t],
  );

  return (
    <>
      {/* Status changes are announced here — a toast alone is invisible to a
          screen reader following the form. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl shadow-xl lg:grid-cols-5">
        {/* ── Intro panel ─────────────────────────────────────────── */}
        <div
          className={clsx(
            "relative flex flex-col justify-between gap-10 overflow-hidden px-8 py-12",
            "bg-linear-120 from-primary-dark via-primary to-secondary-dark",
            "lg:col-span-2",
          )}
        >
          {/* Depth, not content — kept out of the a11y tree. */}
          <div
            aria-hidden
            className="absolute -top-16 -right-16 size-56 rounded-full bg-white/5"
          />
          <div
            aria-hidden
            className="absolute -bottom-12 -left-12 size-44 rounded-full bg-white/5"
          />

          <div className="relative z-10 flex flex-col gap-5">
            <div
              aria-hidden
              className="flex size-14 items-center justify-center rounded-2xl bg-white/15"
            >
              <Leaf size={28} color="#fff" strokeWidth={1.8} />
            </div>
            <Title level="h1" size="h3" weight="semibold" color="white">
              {t("page.title")}
            </Title>
            <Text variant="p" color="white" className="opacity-80">
              {t("page.subtitle")}
            </Text>
          </div>

          <ul
            aria-label={t("a11y.infoListLabel")}
            className="relative z-10 flex list-none flex-col gap-4"
          >
            {INFO_ITEMS.map(({ key, icon: Icon }) => (
              <li key={key} className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15"
                >
                  <Icon size={16} color="#fff" strokeWidth={2} />
                </div>
                <Text variant="span" size="sm" color="white" className="opacity-85">
                  {t(`info.${key}`)}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Form panel ──────────────────────────────────────────── */}
        <div className="flex flex-col justify-center bg-surface px-6 py-10 sm:px-8 lg:col-span-3">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <CheckCircle
                size={72}
                strokeWidth={1.5}
                aria-hidden
                className="text-primary"
              />
              <Title level="h2" size="h5" weight="semibold" align="center">
                {t("feedback.successTitle")}
              </Title>
              <Text variant="p" color="secondary" align="center" className="max-w-xs">
                {t("feedback.successDescription")}
              </Text>
              <Button
                text={t("form.sendAnother")}
                variant="outline"
                size="md"
                onPress={reset}
              />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label={t("a11y.formLabel")}
              aria-busy={loading}
              className="flex w-full flex-col gap-5"
            >
              <Input
                name="name"
                label={t("form.name")}
                placeholder={t("form.namePlaceholder")}
                type="text"
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  clearError("name");
                }}
                leftIcon={User}
                autoComplete="name"
                required
                hasError={Boolean(errors.name)}
                errorMessage={errors.name}
              />

              <Input
                name="email"
                label={t("form.email")}
                placeholder={t("form.emailPlaceholder")}
                type="email"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  clearError("email");
                }}
                leftIcon={Mail}
                autoComplete="email"
                required
                hasError={Boolean(errors.email)}
                errorMessage={errors.email}
              />

              <Select
                name="subject"
                label={t("form.subject")}
                placeholder={t("form.subjectPlaceholder")}
                value={subject}
                onChange={(value) => {
                  setSubject(value as ContactSubject);
                  clearError("subject");
                }}
                options={subjectOptions}
                leftIcon={Tag}
                searchEnabled={false}
                noResultsText={t("noResults")}
                errorMessage={errors.subject}
              />

              <TextArea
                name="message"
                label={t("form.message")}
                placeholder={t("form.messagePlaceholder")}
                value={message}
                onChangeText={(v) => {
                  setMessage(v);
                  clearError("message");
                }}
                maxLength={1000}
                rows={6}
                required
                hasError={Boolean(errors.message)}
                errorMessage={errors.message}
              />

              <div className="mt-1 flex flex-col items-center gap-3">
                <Button
                  text={loading ? t("form.sending") : t("form.submit")}
                  type="submit"
                  loading={loading}
                  rightIcon={Send}
                  fullWidth
                  size="md"
                />
                <Text variant="span" size="sm" color="tertiary" align="center">
                  {t("form.footer")}
                </Text>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
