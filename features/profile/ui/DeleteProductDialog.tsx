"use client";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/Overlays/ConfirmDialog";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

interface DeleteProductDialogProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteProductDialog({
  isOpen,
  productName,
  onClose,
  onConfirm,
  loading,
}: DeleteProductDialogProps) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      tone="danger"
      confirmIcon={Trash2}
      title={t("dashboard.listings.delete.title")}
      description={t("dashboard.listings.delete.description", { name: productName })}
      cancelLabel={t("dashboard.listings.delete.cancel")}
      confirmLabel={t("dashboard.listings.delete.confirm")}
      loadingLabel={t("dashboard.listings.delete.deleting")}
    />
  );
}
