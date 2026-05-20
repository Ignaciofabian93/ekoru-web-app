"use client";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import MainButton from "@/components/Button/MainButton";

export function Logout() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <section className="w-full max-w-xl mx-auto flex items-center justify-center mb-8 mt-24 px-8">
      <MainButton text={t("logout")} variant="error" size="md" fullWidth />
    </section>
  );
}
