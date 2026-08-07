"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Modal } from "@/components/Overlays/Modal";
import { TextArea } from "@/components/Primitives/TextArea";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { DollarSign, Save } from "lucide-react";
import { useState } from "react";
import type { StoreListProduct } from "@/features/stores/types";
import {
  MAX_PRODUCT_IMAGES,
  MIN_PRODUCT_IMAGES,
} from "@/features/publish/constants/options";
import { useImageUpload } from "@/features/publish/hooks/useImageUpload";
import { Toggle } from "@/components/Primitives/Toggle";
import { useSeller } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import { NAMESPACE } from "../i18n";
import type { UpdateStoreProductPatch } from "../hooks/useStoreProductActions";
import { EditImagesField, type EditableImage } from "./EditImagesField";

interface Props {
  isOpen: boolean;
  product: StoreListProduct;
  loading?: boolean;
  onClose: () => void;
  onSave: (patch: UpdateStoreProductPatch) => void;
}

// Rendered with `key={product.id}` by the parent so switching products gives a
// fresh instance and the useState seeds re-run from props.
export function EditStoreProductDialog({
  isOpen,
  product,
  loading,
  onClose,
  onSave,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const { uploading, uploadImages } = useImageUpload();

  const [name, setName] = useState(product.name ?? "");
  const [brand, setBrand] = useState(product.brand ?? "");
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [stock, setStock] = useState(String(product.stock ?? ""));
  const [description, setDescription] = useState(product.description ?? "");
  const [hasOffer, setHasOffer] = useState(Boolean(product.hasOffer));
  const [offerPrice, setOfferPrice] = useState(String(product.offerPrice ?? ""));

  // Existing images start as stored keys; anything picked here joins the same
  // ordered list and is uploaded on save.
  const [images, setImages] = useState<EditableImage[]>(() =>
    (product.images ?? []).map((key) => ({ kind: "stored", key }) as const),
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

  const [submitted, setSubmitted] = useState(false);
  const busy = Boolean(loading) || uploading;

  const numericPrice = Number(price);
  const numericOffer = Number(offerPrice);
  // An offer that doesn't undercut the price would render as a nonsense
  // struck-through original on the card.
  const offerValid =
    !hasOffer || (!Number.isNaN(numericOffer) && numericOffer > 0 && numericOffer < numericPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const numericStock = Number(stock);
    if (!name.trim() || Number.isNaN(numericPrice) || numericPrice < 0) return;
    if (!offerValid || images.length < MIN_PRODUCT_IMAGES || busy) return;

    if (!seller?.id) {
      toast.error(t("dashboard.listings.edit.error"));
      return;
    }

    // Upload only what's new, then rebuild the key list in display order so the
    // seller's cover choice survives.
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
      brand: brand.trim(),
      price: numericPrice,
      stock: Number.isNaN(numericStock) ? 0 : numericStock,
      description: description.trim(),
      images: keys,
      hasOffer,
      offerPrice: hasOffer ? numericOffer : null,
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
        {/* Offer — the price only appears once the offer is switched on, so an
            inactive listing can't carry a half-set discount. */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Text variant="span" weight="medium" size="base">
              {t("dashboard.listings.edit.hasOffer")}
            </Text>
            <Toggle
              checked={hasOffer}
              onChange={setHasOffer}
              ariaLabel={t("dashboard.listings.edit.hasOffer")}
            />
          </div>
          {hasOffer && (
            <Input
              label={t("dashboard.listings.edit.offerPrice")}
              value={offerPrice}
              onChangeText={(v) => setOfferPrice(v.replace(/[^\d.]/g, ""))}
              leftIcon={DollarSign}
              inputMode="decimal"
              errorMessage={
                submitted && !offerValid
                  ? t("dashboard.listings.edit.offerPriceInvalid")
                  : undefined
              }
            />
          )}
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
          error={
            submitted && images.length < MIN_PRODUCT_IMAGES
              ? t("dashboard.listings.edit.imagesRequired")
              : undefined
          }
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
