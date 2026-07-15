"use client";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import MainButton from "@/components/Button/MainButton";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function Logout() {
  const { t } = useTranslation(NAMESPACE);
  const { handleLogout, loading } = useLogout();

  return (
    <MainButton
      text={t("logout")}
      variant="error"
      size="md"
      fullWidth
      onPress={handleLogout}
      loading={loading}
    />
  );
}
