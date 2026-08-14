"use client";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Button } from "@/components/Primitives/Button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { LogOut } from "lucide-react";

export function Logout() {
  const { t } = useTranslation(NAMESPACE);
  const { handleLogout, loading } = useLogout();

  return (
    <Button
      text={t("logout")}
      variant="error"
      size="md"
      onPress={handleLogout}
      loading={loading}
      rightIcon={LogOut}
    />
  );
}
