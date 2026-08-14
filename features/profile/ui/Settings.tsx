"use client";
import { Button } from "@/components/Primitives/Button";
import { useTranslation } from "@/i18n/context";
import { Save, ShieldAlert, Trash2 } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { SETTINGS_SECTIONS } from "../constants/menuItems";
import { useSellerPreferences } from "../hooks/useSellerPreferences";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";
import { SettingRow } from "./SettingRow";
import { ComingSoonChip } from "@/components/Primitives";

export function Settings() {
  const { t } = useTranslation(NAMESPACE);
  const {
    state,
    toggle,
    dirty,
    save,
    saving,
    deactivateAccount,
    deactivating,
    deleteAccount,
    deleting,
  } = useSellerPreferences();
  const { handleLogout } = useLogout();
  const busy = deactivating || deleting;

  const handleAction = async (action: "deactivate" | "delete") => {
    if (action === "deactivate") {
      if (window.confirm(t("settings.deactivateConfirm"))) {
        await deactivateAccount();
      }
      return;
    }
    // Delete is irreversible: hard confirm, then sign out + redirect on success
    // (the account is anonymised and locked server-side).
    if (window.confirm(t("settings.deleteConfirm"))) {
      const ok = await deleteAccount();
      if (ok) await handleLogout();
    }
  };

  const toggleSections = SETTINGS_SECTIONS.filter((s) => s.key !== "danger");
  const dangerSection = SETTINGS_SECTIONS.find((s) => s.key === "danger");

  return (
    <div className="flex flex-col gap-5">
      {toggleSections.map((section) => (
        <SectionCard
          key={section.key}
          icon={section.icon}
          tone={section.tone}
          title={t(section.label)}
          subtitle={t(section.subtitle)}
        >
          {section.items.map((item) =>
            item.kind === "toggle" ? (
              <SettingRow
                key={item.field}
                kind="toggle"
                icon={item.icon}
                label={t(item.label)}
                description={t(item.description)}
                checked={state[item.field]}
                onChange={(v) => toggle(item.field, v)}
                disabled={!item.available}
                badge={
                  item.available ? undefined : (
                    <ComingSoonChip label={t("settings.comingSoon")} />
                  )
                }
              />
            ) : null,
          )}
        </SectionCard>
      ))}

      {/* Save preferences */}
      <Button
        text={saving ? t("settings.saving") : t("settings.save")}
        leftIcon={Save}
        loading={saving}
        disabled={!dirty || saving}
        onClick={() => void save()}
        size="md"
        fullWidth
      />

      {/* Danger zone (account actions, not toggles) */}
      {dangerSection && (
        <SectionCard
          icon={dangerSection.icon}
          tone="danger"
          background="danger"
          title={t(dangerSection.label)}
          subtitle={t(dangerSection.subtitle)}
          className="border-danger/20"
        >
          {dangerSection.items.map((item) =>
            item.kind === "action" ? (
              <SettingRow
                key={item.action}
                icon={item.icon}
                label={t(item.label)}
                description={t(item.description)}
                badge={
                  item.available ? undefined : (
                    <ComingSoonChip label={t("settings.comingSoon")} />
                  )
                }
                right={
                  <Button
                    text={
                      item.action === "deactivate"
                        ? t("settings.deactivate")
                        : deleting
                          ? t("settings.deleting")
                          : t("settings.deleteAccount")
                    }
                    variant="error"
                    size="sm"
                    loading={item.action === "deactivate" ? deactivating : deleting}
                    disabled={!item.available || busy}
                    onClick={() => void handleAction(item.action)}
                    leftIcon={item.action === "deactivate" ? ShieldAlert : Trash2}
                  />
                }
              />
            ) : null,
          )}
        </SectionCard>
      )}
    </div>
  );
}
