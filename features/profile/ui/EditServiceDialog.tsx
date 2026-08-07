"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Modal } from "@/components/Overlays/Modal";
import { TextArea } from "@/components/Primitives/TextArea";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { Clock, DollarSign, Save } from "lucide-react";
import { useState } from "react";
import type { ServiceNode } from "@/features/services/types";
import { MAX_PRODUCT_IMAGES } from "@/features/publish/constants/options";
import { useImageUpload } from "@/features/publish/hooks/useImageUpload";
import { useSeller } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import { NAMESPACE } from "../i18n";
import type { UpdateServicePatch } from "../hooks/useServiceActions";
import { EditImagesField, type EditableImage } from "./EditImagesField";

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
  const toast = useToast();
  const seller = useSeller();
  const { uploading, uploadImages } = useImageUpload();

  const [name, setName] = useState(service.name ?? "");
  const [description, setDescription] = useState(service.description ?? "");
  const [basePrice, setBasePrice] = useState(String(service.basePrice ?? ""));
  const [duration, setDuration] = useState(String(service.duration ?? ""));

  // Unlike products, a service may legitimately carry no photo — the card falls
  // back to a placeholder — so there is no minimum here.
  const [images, setImages] = useState<EditableImage[]>(() =>
    (service.images ?? []).map((key) => ({ kind: "stored", key }) as const),
  );

  const addImage = (file: File) =>
    setImages((prev) =>
      prev.length >= MAX_PRODUCT_IMAGES ? prev : [...prev, { kind: "new", file }],
    );
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));
  const moveImageBackward = (index: number) =>
    setImages((prev) => {
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });

  const busy = Boolean(loading) || uploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(basePrice);
    const numericDuration = Number(duration);
    if (!name.trim() || Number.isNaN(numericPrice) || numericPrice < 0) return;
    if (busy) return;

    if (!seller?.id) {
      toast.error(t("dashboard.listings.edit.error"));
      return;
    }

    // Upload only what's new, then rebuild the key list in display order so the
    // provider's cover choice survives.
    let keys: string[];
    try {
      const pending = images.filter((i) => i.kind === "new").map((i) => i.file);
      const uploaded = pending.length ? await uploadImages(pending, seller.id) : [];
      let next = 0;
      keys = images.map((image) =>
        image.kind === "stored" ? image.key : uploaded[next++],
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("dashboard.listings.edit.error"),
      );
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      basePrice: numericPrice,
      duration: Number.isNaN(numericDuration) ? 0 : numericDuration,
      images: keys,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={!busy}>
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

        <EditImagesField
          images={images}
          onAdd={addImage}
          onRemove={removeImage}
          onMoveBackward={moveImageBackward}
          max={MAX_PRODUCT_IMAGES}
          label={t("dashboard.listings.edit.images")}
          hint={t("dashboard.listings.edit.imagesHint")}
          addLabel={t("dashboard.listings.edit.addPhoto")}
          removeLabel={t("dashboard.listings.edit.removePhoto")}
          coverLabel={t("dashboard.listings.edit.cover")}
          makeCoverLabel={t("dashboard.listings.edit.makeCover")}
        />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            text={t("dashboard.listings.edit.cancel")}
            variant="outline"
            size="md"
            onPress={onClose}
            disabled={busy}
          />
          <Button
            text={
              busy
                ? t("dashboard.listings.edit.saving")
                : t("dashboard.listings.edit.save")
            }
            variant="primary"
            size="md"
            leftIcon={Save}
            type="submit"
            loading={busy}
          />
        </div>
      </form>
    </Modal>
  );
}
