"use client";
import MainButton from "@/components/Button/MainButton";
import Modal from "@/components/Modal/Modal";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import { AlertTriangle, Trash2 } from "lucide-react";
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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!loading}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle size={26} color="currentColor" strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Text variant="span" weight="bold" size="lg">
            {t("dashboard.listings.delete.title")}
          </Text>
          <Text variant="p" size="sm" color="secondary" align="center">
            {t("dashboard.listings.delete.description", { name: productName })}
          </Text>
        </div>
        <div className="mt-2 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <MainButton
            text={t("dashboard.listings.delete.cancel")}
            variant="outline"
            size="md"
            onPress={onClose}
            disabled={loading}
          />
          <MainButton
            text={loading ? t("dashboard.listings.delete.deleting") : t("dashboard.listings.delete.confirm")}
            variant="error"
            size="md"
            leftIcon={Trash2}
            onPress={onConfirm}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
