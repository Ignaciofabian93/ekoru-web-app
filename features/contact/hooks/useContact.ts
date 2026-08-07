"use client";
import { useCallback, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import { isMinLength, isValidEmail, sanitizeOnSubmit } from "@/utils/inputValidations";
import { SendContactMessage } from "@/lib/api/contact";
import { NAMESPACE } from "../i18n";
import type { ContactSubject } from "../constants/subjects";

const MIN_MESSAGE_LENGTH = 10;

/** Field order doubles as the order errors are focused in. */
const FIELDS = ["name", "email", "subject", "message"] as const;
export type ContactField = (typeof FIELDS)[number];

export type ContactErrors = Partial<Record<ContactField, string>>;

export function useContact() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<ContactSubject | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  /**
   * Pushes a message into the polite live region. Cleared first so repeating
   * the same text still re-triggers the announcement — screen readers ignore a
   * region whose content hasn't changed.
   */
  const announce = useCallback((text: string) => {
    setLiveMessage("");
    requestAnimationFrame(() => setLiveMessage(text));
  }, []);

  /** Clears one field's error as soon as the visitor edits it. */
  const clearError = useCallback((field: ContactField) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = sanitizeOnSubmit(name);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    const nextErrors: ContactErrors = {};
    if (!trimmedName) nextErrors.name = t("feedback.nameError");
    if (!isValidEmail(trimmedEmail)) nextErrors.email = t("feedback.emailError");
    if (!subject) nextErrors.subject = t("feedback.subjectError");
    if (!isMinLength(trimmedMessage, MIN_MESSAGE_LENGTH)) {
      nextErrors.message = t("feedback.messageError");
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      announce(t("a11y.validationError"));
      // Send focus to the first field at fault, so the problem is reachable
      // without hunting back up the form.
      const firstBad = FIELDS.find((field) => nextErrors[field]);
      if (firstBad) document.getElementById(firstBad)?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await SendContactMessage({
        name: trimmedName,
        email: trimmedEmail,
        subject,
        message: trimmedMessage,
      });

      toast.success(t("feedback.success"));
      announce(t("a11y.successAnnouncement"));
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      toast.error(t("feedback.error"));
      announce(t("feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  /** Returns to a blank form after a successful send. */
  const reset = useCallback(() => {
    setSent(false);
    setErrors({});
  }, []);

  return {
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
  };
}
