"use client";
import MainButton from "@/components/Button/MainButton";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import { DollarSign, Save } from "lucide-react";
import { useState } from "react";
import type { StoreListProduct } from "@/features/stores/types";
import { NAMESPACE } from "../i18n";
import type { UpdateStoreProductPatch } from "../hooks/useStoreProductActions";

interface Props {
  isOpen: boolean;
  product: StoreListProduct;
  loading?: boolean;
  onClose: () => void;
  onSave: (patch: UpdateStoreProductPatch) => void;
}

// Rendered with `key={product.id}` by the parent so switching products gives a
// fresh instance and the useState seeds re-run from props.
export function EditStoreProductDialog({ isOpen, product, loading, onClose, onSave }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const [name, setName] = useState(product.name ?? "");
  const [brand, setBrand] = useState(product.brand ?? "");
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [stock, setStock] = useState(String(product.stock ?? ""));
  const [description, setDescription] = useState(product.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (!name.trim() || Number.isNaN(numericPrice) || numericPrice < 0) return;
    onSave({
      name: name.trim(),
      brand: brand.trim(),
      price: numericPrice,
      stock: Number.isNaN(numericStock) ? 0 : numericStock,
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
            label={t("dashboard.listings.edit.stock")}
            value={stock}
            onChangeText={(v) => setStock(v.replace(/[^\d]/g, ""))}
            inputMode="numeric"
          />
        </div>
        <Input
          label={t("dashboard.listings.edit.price")}
          value={price}
          onChangeText={(v) => setPrice(v.replace(/[^\d.]/g, ""))}
          leftIcon={DollarSign}
          inputMode="decimal"
        />
        <TextArea
          label={t("dashboard.listings.edit.description")}
          value={description}
          onChangeText={setDescription}
          rows={4}
          maxLength={1000}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <MainButton
            text={t("dashboard.listings.edit.cancel")}
            variant="outline"
            size="md"
            onPress={onClose}
            disabled={loading}
          />
          <MainButton
            text={loading ? t("dashboard.listings.edit.saving") : t("dashboard.listings.edit.save")}
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
