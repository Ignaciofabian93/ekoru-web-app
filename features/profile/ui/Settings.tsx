"use client";
import Select from "@/components/Select/Select";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import MainButton from "@/components/Button/MainButton";
import { CURRENCIES_SUPPORTED, LANGUAGES_AVAILABLE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Check, DollarSign, Globe, Trash2 } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const { t } = useTranslation(NAMESPACE);
  const [language, setLanguage] = useState("es");
  const [currency, setCurrency] = useState("USD");

  return (
    <section className="w-full max-w-3xl mx-auto my-8 px-8 flex flex-col gap-10">
      {/* Preferences */}
      <div>
        <div className="mb-4">
          <Title level="h5" size="h5">
            {t("settings.preferences")}
          </Title>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-start">
            <div className="bg-primary-light/20 p-3 rounded-lg text-primary shrink-0">
              <Globe size={18} />
            </div>
            <div className="ml-4 flex-1">
              <Text variant="span" weight="semibold" size="base" color="tertiary">
                {t("settings.language")}
              </Text>
              <div className="flex flex-wrap gap-2 mt-2">
                {LANGUAGES_AVAILABLE.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      language === lang.code
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent border-gray-300 hover:border-primary"
                    }`}
                  >
                    {language === lang.code && <Check size={12} />}
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-primary-light/20 p-3 rounded-lg text-primary shrink-0">
              <DollarSign size={18} />
            </div>
            <div className="ml-4 flex-1">
              <Text variant="span" weight="semibold" size="base" color="tertiary">
                {t("settings.currency")}
              </Text>
              <div className="mt-2">
                <Select
                  options={CURRENCIES_SUPPORTED.map((c) => ({ label: c, value: c }))}
                  value={currency}
                  onChange={(v) => setCurrency(String(v))}
                  width="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <Title level="h5" size="h5">
            {t("settings.dangerZone")}
          </Title>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg text-red-500 shrink-0">
            <Trash2 size={18} />
          </div>
          <div className="flex-1">
            <Text variant="span" weight="normal" size="base">
              {t("settings.deleteAccount")}
            </Text>
            <Text variant="p" size="sm" color="tertiary">
              {t("settings.deleteAccountDescription")}
            </Text>
          </div>
        </div>
        <MainButton text={t("settings.deleteAccount")} variant="error" size="sm" />
      </div>
    </section>
  );
}
