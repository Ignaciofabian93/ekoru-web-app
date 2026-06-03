"use client";
import { useMemo } from "react";
import MainButton from "@/components/Button/MainButton";
import Input from "@/components/Input/Input";
import { Select, type Option } from "@/components/Select/Select";
import TextArea from "@/components/TextArea/TextArea";
import { useTranslation } from "@/i18n/context";
import { isValidEmail } from "@/utils/inputValidations";
import { Mail, Send, Tag, User } from "lucide-react";
import { CONTACT_SUBJECTS, type ContactSubject } from "../constants/subjects";
import { useContact } from "../hooks/useContact";

export function ContactForm() {
  const { t } = useTranslation("contact");
  const {
    name,
    setName,
    email,
    setEmail,
    subject,
    setSubject,
    message,
    setMessage,
    loading,
    handleSubmit,
  } = useContact();

  const subjectOptions = useMemo<Option[]>(
    () => CONTACT_SUBJECTS.map((value) => ({ value, label: t(`subjects.${value}`) })),
    [t],
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <Input
        name="name"
        label={t("form.name")}
        placeholder={t("form.namePlaceholder")}
        type="text"
        value={name}
        onChangeText={setName}
        leftIcon={User}
        autoComplete="name"
        required
        errorMessage={t("feedback.nameError")}
      />

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

      <Select
        name="subject"
        label={t("form.subject")}
        placeholder={t("form.subjectPlaceholder")}
        value={subject}
        onChange={(value) => setSubject(value as ContactSubject)}
        options={subjectOptions}
        leftIcon={Tag}
        searchEnabled={false}
        noResultsText={t("noResults")}
      />

      <TextArea
        label={t("form.message")}
        placeholder={t("form.messagePlaceholder")}
        value={message}
        onChangeText={setMessage}
        maxLength={1000}
        rows={6}
      />

      <MainButton
        text={t("form.submit")}
        type="submit"
        loading={loading}
        rightIcon={Send}
        fullWidth
        size="md"
      />
    </form>
  );
}
