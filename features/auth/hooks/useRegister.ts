"use client";
import { REGISTER_BUSINESS, REGISTER_PERSON } from "@/graphql/auth/register";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  type SupportedLanguage,
} from "@/constants/settings";
import { useNavigation } from "@/hooks/useNavigation";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import type { BusinessType, SellerType } from "@/types/enums";
import { getCookie } from "@/utils/cookies";
import { sanitizeOnSubmit } from "@/utils/inputValidations";
import { useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export function useRegister() {
  const { replace } = useNavigation();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("auth");

  const [sellerType, setSellerType] = useState<SellerType>("PERSON");
  const handleSellerType = (type: SellerType) => setSellerType(type);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("RETAIL");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerPerson, { loading: personLoading }] = useMutation(REGISTER_PERSON);
  const [registerBusiness, { loading: businessLoading }] = useMutation(REGISTER_BUSINESS);

  const loading = personLoading || businessLoading;

  const handleRegister = async (): Promise<boolean> => {
    // The active locale comes from the URL; fall back to the persisted cookie.
    const storedLanguage = params.lang ?? getCookie(LANGUAGE_COOKIE) ?? undefined;

    // Mobile keyboards and clipboard managers frequently introduce trailing
    // whitespace or capitalization on the email field. The backend rejects
    // unnormalized emails with a 400, so normalize before submit.
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    try {
      if (sellerType === "PERSON") {
        await registerPerson({
          variables: {
            input: {
              sellerType,
              firstName: sanitizeOnSubmit(firstName),
              lastName: sanitizeOnSubmit(lastName),
              email: normalizedEmail,
              password: normalizedPassword,
            },
            language: storedLanguage?.toUpperCase() || "ES",
          },
        });
      } else {
        await registerBusiness({
          variables: {
            input: {
              sellerType,
              businessType,
              businessName: sanitizeOnSubmit(businessName),
              displayName: sanitizeOnSubmit(displayName),
              email: normalizedEmail,
              password: normalizedPassword,
            },
            language: storedLanguage?.toUpperCase() || "ES",
          },
        });
      }

      toast.success(t("feedback.registerSuccess"));
      const lang = storedLanguage ?? DEFAULT_LANGUAGE;
      replace({ route: `/${lang}/login` });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
      return false;
    }
  };

  return {
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
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleRegister,
  };
}
