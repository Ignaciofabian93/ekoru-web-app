"use client";
import MainButton from "@/components/Button/MainButton";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import { Clock, DollarSign, Save } from "lucide-react";
import { useState } from "react";
import type { ServiceNode } from "@/features/services/types";
import { NAMESPACE } from "../i18n";
import type { UpdateServicePatch } from "../hooks/useServiceActions";

interface Props {
  isOpen: boolean;
  service: ServiceNode;
  loading?: boolean;
  onClose: () => void;
  onSave: (patch: UpdateServicePatch) => void;
}

// Rendered with `key={service.id}` by the parent so switching services gives a
// fresh instance and the useState seeds re-run from props.
export function EditServiceDialog({ isOpen, service, loading, onClose, onSave }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const [name, setName] = useState(service.name ?? "");
  const [description, setDescription] = useState(service.description ?? "");
  const [basePrice, setBasePrice] = useState(String(service.basePrice ?? ""));
  const [duration, setDuration] = useState(String(service.duration ?? ""));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(basePrice);
    const numericDuration = Number(duration);
    if (!name.trim() || Number.isNaN(numericPrice) || numericPrice < 0) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      basePrice: numericPrice,
      duration: Number.isNaN(numericDuration) ? 0 : numericDuration,
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
            label={t("dashboard.listings.edit.price")}
            value={basePrice}
            onChangeText={(v) => setBasePrice(v.replace(/[^\d.]/g, ""))}
            leftIcon={DollarSign}
            inputMode="decimal"
          />
          <Input
            label={t("dashboard.listings.edit.duration")}
            value={duration}
            onChangeText={(v) => setDuration(v.replace(/[^\d]/g, ""))}
            leftIcon={Clock}
            inputMode="numeric"
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
