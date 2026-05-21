"use client";
import Select from "@/components/Select/Select";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import MainButton from "@/components/Button/MainButton";
import {
  CURRENCIES_SUPPORTED,
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  hasCurrency,
  LANGUAGES_AVAILABLE,
} from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { DollarSign, Globe, Trash2 } from "lucide-react";
import { useCookieState } from "@/hooks/useCookieState";
import { useLanguage } from "@/hooks/useLanguage";

export function Settings() {
  const { t } = useTranslation(NAMESPACE);
  const [language, changeLanguage] = useLanguage();
  const [currency, setCurrency] = useCookieState(
    CURRENCY_COOKIE,
    DEFAULT_CURRENCY,
    hasCurrency,
  );

  return (
    <section className="w-full max-w-3xl mx-auto my-8 px-8 flex flex-col gap-10">
      {/* Preferences */}
      <div>
        <div className="mb-6">
          <Title level="h5" size="h5">
            {t("settings.preferences")}
          </Title>
        </div>
        <div className="flex flex-col gap-8 w-full">
          <div className="flex items-end">
            <div className="bg-primary-light/20 p-2 rounded-lg text-primary shrink-0">
              <Globe size={18} />
            </div>
            <div className="ml-4 flex-1">
              <Text variant="span" weight="semibold" size="base" color="tertiary">
                {t("settings.language")}
              </Text>
              <div className="mt-2 max-w-70">
                <Select
                  options={LANGUAGES_AVAILABLE.map((lang) => ({
                    label: lang.name,
                    value: lang.code,
                  }))}
                  value={language}
                  onChange={(v) => changeLanguage(String(v))}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-end w-full">
            <div className="bg-primary-light/20 p-2 rounded-lg text-primary shrink-0 mb-0.5">
              <DollarSign size={18} />
            </div>
            <div className="ml-4 flex-1">
              <Text variant="span" weight="semibold" size="base" color="tertiary">
                {t("settings.currency")}
              </Text>
              <div className="mt-2 max-w-70">
                <Select
                  options={CURRENCIES_SUPPORTED.map((c) => ({ label: c, value: c }))}
                  value={currency}
                  onChange={(v) => setCurrency(String(v))}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="flex flex-col gap-4 mt-12">
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
