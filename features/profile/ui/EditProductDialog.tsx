"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Modal } from "@/components/Overlays/Modal";
import { TextArea } from "@/components/Primitives/TextArea";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { DollarSign, Save } from "lucide-react";
import { useState } from "react";
import type { SellerStorefrontProduct } from "@/features/seller/types";
import { NAMESPACE } from "../i18n";
import type { UpdateProductPatch } from "../hooks/useProductActions";

interface EditProductDialogProps {
  isOpen: boolean;
  product: SellerStorefrontProduct;
  loading?: boolean;
  onClose: () => void;
  onSave: (patch: UpdateProductPatch) => void;
}

// Parent renders this with `key={product.id}` so opening edit on a different
// product gives a fresh component instance — that's why the useState
// initializers below seed once from props and don't need an effect to sync.
export function EditProductDialog({
  isOpen,
  product,
  loading,
  onClose,
  onSave,
}: EditProductDialogProps) {
  const { t } = useTranslation(NAMESPACE);

  const [name, setName] = useState(product.name ?? "");
  const [brand, setBrand] = useState(product.brand ?? "");
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [description, setDescription] = useState(product.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    if (!name.trim() || Number.isNaN(numericPrice) || numericPrice < 0) return;
    onSave({
      name: name.trim(),
      brand: brand.trim(),
      price: numericPrice,
      description: description.trim(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={!loading}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Text variant="span" weight="bold" size="lg">
            {t("dashboard.listings.edit.title")}
          </Text>
          <Text variant="p" size="sm" color="tertiary">
            {t("dashboard.listings.edit.subtitle")}
          </Text>
        </div>

        <Input
          label={t("dashboard.listings.edit.name")}
          value={name}
          onChangeText={setName}
          required
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t("dashboard.listings.edit.brand")}
            value={brand}
            onChangeText={setBrand}
          />
          <Input
            label={t("dashboard.listings.edit.price")}
            value={price}
            onChangeText={(v) => setPrice(v.replace(/[^\d.]/g, ""))}
            leftIcon={DollarSign}
            inputMode="decimal"
          />
        </div>
        <TextArea
          label={t("dashboard.listings.edit.description")}
          value={description}
          onChangeText={setDescription}
          rows={4}
          maxLength={1000}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            text={t("dashboard.listings.edit.cancel")}
            variant="outline"
            size="md"
            onPress={onClose}
            disabled={loading}
          />
          <Button
            text={
              loading
                ? t("dashboard.listings.edit.saving")
                : t("dashboard.listings.edit.save")
            }
            variant="primary"
            size="md"
            leftIcon={Save}
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  );
}
