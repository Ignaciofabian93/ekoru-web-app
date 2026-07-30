"use client";
import { Button } from "@/components/Primitives/Button";
import { Select } from "@/components/Primitives/Select";
import { Text } from "@/components/Primitives/Text";
import {
  CURRENCIES_SUPPORTED,
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  hasCurrency,
  LANGUAGES_AVAILABLE,
} from "@/constants/settings";
import { useCookieState } from "@/hooks/useCookieState";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import {
  Bell,
  BellRing,
  CalendarClock,
  DollarSign,
  EyeOff,
  Globe,
  KeyRound,
  Mail,
  Repeat2,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";
import { SettingRow } from "./SettingRow";

export function Settings() {
  const { t } = useTranslation(NAMESPACE);
  const [language, changeLanguage] = useLanguage();
  const [currency, setCurrency] = useCookieState(
    CURRENCY_COOKIE,
    DEFAULT_CURRENCY,
    hasCurrency,
  );

  // Local-only toggles — wire to user-preferences mutation later.
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showInSearch, setShowInSearch] = useState(true);
  const [allowExchanges, setAllowExchanges] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="flex flex-col gap-5">
      {/* Preferences */}
      <SectionCard
        icon={Globe}
        title={t("settings.preferences")}
        subtitle={t("settings.preferencesSubtitle")}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Text variant="span" weight="semibold" size="sm">
              {t("settings.language")}
            </Text>
            <Select
              options={LANGUAGES_AVAILABLE.map((lang) => ({
                label: lang.name,
                value: lang.code,
              }))}
              value={language}
              onChange={(v) => changeLanguage(String(v))}
              leftIcon={Globe}
              size="md"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Text variant="span" weight="semibold" size="sm">
              {t("settings.currency")}
            </Text>
            <Select
              options={CURRENCIES_SUPPORTED.map((c) => ({ label: c, value: c }))}
              value={currency}
              onChange={(v) => setCurrency(String(v))}
              leftIcon={DollarSign}
              size="md"
            />
          </div>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        icon={Bell}
        title={t("settings.notifications")}
        subtitle={t("settings.notificationsSubtitle")}
      >
        <SettingRow
          kind="toggle"
          icon={Mail}
          label={t("settings.emailNotifications")}
          description={t("settings.emailNotificationsDescription")}
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        <SettingRow
          kind="toggle"
          icon={BellRing}
          label={t("settings.pushNotifications")}
          description={t("settings.pushNotificationsDescription")}
          checked={pushNotifications}
          onChange={setPushNotifications}
        />
        <SettingRow
          kind="toggle"
          icon={Mail}
          label={t("settings.marketingEmails")}
          description={t("settings.marketingEmailsDescription")}
          checked={marketingEmails}
          onChange={setMarketingEmails}
        />
        <SettingRow
          kind="toggle"
          icon={CalendarClock}
          label={t("settings.weeklySummary")}
          description={t("settings.weeklySummaryDescription")}
          checked={weeklySummary}
          onChange={setWeeklySummary}
        />
      </SectionCard>

      {/* Privacy */}
      <SectionCard
        icon={Shield}
        title={t("settings.privacy")}
        subtitle={t("settings.privacySubtitle")}
      >
        <SettingRow
          kind="toggle"
          icon={UserCircle}
          label={t("settings.publicProfile")}
          description={t("settings.publicProfileDescription")}
          checked={publicProfile}
          onChange={setPublicProfile}
        />
        <SettingRow
          kind="toggle"
          icon={Search}
          label={t("settings.showInSearch")}
          description={t("settings.showInSearchDescription")}
          checked={showInSearch}
          onChange={setShowInSearch}
        />
        <SettingRow
          kind="toggle"
          icon={Repeat2}
          label={t("settings.allowExchanges")}
          description={t("settings.allowExchangesDescription")}
          checked={allowExchanges}
          onChange={setAllowExchanges}
        />
      </SectionCard>

      {/* Security */}
      <SectionCard
        icon={ShieldCheck}
        tone="success"
        title={t("settings.security")}
        subtitle={t("settings.securitySubtitle")}
      >
        <SettingRow
          kind="toggle"
          icon={KeyRound}
          label={t("settings.twoFactor")}
          description={t("settings.twoFactorDescription")}
          checked={twoFactor}
          onChange={setTwoFactor}
        />
        <SettingRow
          kind="toggle"
          icon={BellRing}
          label={t("settings.loginAlerts")}
          description={t("settings.loginAlertsDescription")}
          checked={loginAlerts}
          onChange={setLoginAlerts}
        />
      </SectionCard>

      {/* Danger zone */}
      <SectionCard
        icon={Trash2}
        tone="danger"
        title={t("settings.dangerZone")}
        subtitle={t("settings.dangerZoneSubtitle")}
        className="border-danger/20"
      >
        <SettingRow
          icon={EyeOff}
          label={t("settings.deactivateAccount")}
          description={t("settings.deactivateAccountDescription")}
          right={
            <Button text={t("settings.deactivate")} variant="outline" size="sm" />
          }
        />
        <SettingRow
          icon={Trash2}
          label={t("settings.deleteAccount")}
          description={t("settings.deleteAccountDescription")}
          right={
            <Button text={t("settings.deleteAccount")} variant="error" size="sm" />
          }
        />
      </SectionCard>
    </div>
  );
}
