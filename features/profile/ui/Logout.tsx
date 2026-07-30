"use client";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Button } from "@/components/Primitives/Button";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function Logout() {
  const { t } = useTranslation(NAMESPACE);
  const { handleLogout, loading } = useLogout();

  return (
    <Button
      text={t("logout")}
      variant="error"
      size="md"
      fullWidth
      onPress={handleLogout}
      loading={loading}
    />
  );
}
