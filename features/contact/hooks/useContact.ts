"use client";
import { useState } from "react";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import { isMinLength, isValidEmail, sanitizeOnSubmit } from "@/utils/inputValidations";
import { SendContactMessage } from "@/lib/api/contact";
import { NAMESPACE } from "../i18n";
import type { ContactSubject } from "../constants/subjects";

const MIN_MESSAGE_LENGTH = 10;

export function useContact() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<ContactSubject | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = sanitizeOnSubmit(name);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (!trimmedName || !isValidEmail(trimmedEmail) || !subject || !isMinLength(trimmedMessage, MIN_MESSAGE_LENGTH)) {
      toast.error(t("feedback.fieldsRequired"));
      return;
    }

    setLoading(true);
    try {
      await SendContactMessage({
        name: trimmedName,
        email: trimmedEmail,
        subject,
        message: trimmedMessage,
      });

      toast.success(t("feedback.success"));
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      toast.error(t("feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
