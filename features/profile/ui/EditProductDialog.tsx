"use client";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Modal } from "@/components/Overlays/Modal";
import { TextArea } from "@/components/Primitives/TextArea";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { DollarSign, Save } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { SellerStorefrontProduct } from "@/features/seller/types";
import {
  MAX_PRODUCT_IMAGES,
  MIN_PRODUCT_IMAGES,
  DESCRIPTION_MIN_LENGTH,
} from "@/features/publish/constants/options";
import { useMarketplaceCategories } from "@/features/publish/hooks/useMarketplaceCategories";
import { useImageUpload } from "@/features/publish/hooks/useImageUpload";
import { ConditionField } from "@/features/publish/ui/fields/ConditionField";
import { ExchangeableField } from "@/features/publish/ui/fields/ExchangeableField";
import { InterestsField } from "@/features/publish/ui/fields/InterestsField";
import { MarketplaceCategoryFields } from "@/features/publish/ui/fields/MarketplaceCategoryFields";
import { useSeller } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import type { ProductCondition } from "@/types/enums";
import { NAMESPACE } from "../i18n";
import type { UpdateProductPatch } from "../hooks/useProductActions";
import { EditImagesField, type EditableImage } from "./EditImagesField";

interface EditProductDialogProps {
  isOpen: boolean;
  product: SellerStorefrontProduct;
  loading?: boolean;
  onClose: () => void;
  onSave: (patch: UpdateProductPatch) => void;
}

/**
 * Full edit for a marketplace listing — the same surface the publish wizard
 * collects, in one scrollable dialog rather than steps, because editing is
 * usually a targeted change rather than a guided flow.
 *
 * The parent renders this with `key={product.id}`, so opening edit on a
 * different product gives a fresh instance; that's why the `useState`
 * initializers seed once from props and need no syncing effect.
 */
export function EditProductDialog({
  isOpen,
  product,
  loading,
  onClose,
  onSave,
}: EditProductDialogProps) {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const seller = useSeller();
  const { uploading, uploadImages } = useImageUpload();

  const [name, setName] = useState(product.name ?? "");
  const [brand, setBrand] = useState(product.brand ?? "");
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [description, setDescription] = useState(product.description ?? "");
  const [color, setColor] = useState(product.color ?? "");
  const [condition, setCondition] = useState<ProductCondition | "">(
    product.condition ?? "",
  );
  const [conditionDescription, setConditionDescription] = useState(
    product.conditionDescription ?? "",
  );
  const [isExchangeable, setIsExchangeable] = useState(
    Boolean(product.isExchangeable),
  );
  const [interests, setInterests] = useState<string[]>(product.interests ?? []);
  const [productCategoryId, setProductCategoryId] = useState<string>(
    product.productCategory?.id ? String(product.productCategory.id) : "",
  );

  // Existing images start as stored keys; anything picked here joins the same
  // ordered list and is uploaded on save.
  const [images, setImages] = useState<EditableImage[]>(() =>
    (product.images ?? []).map((key) => ({ kind: "stored", key }) as const),
  );

  const onLeafChange = useCallback((id: string) => setProductCategoryId(id), []);
  const categories = useMarketplaceCategories({
    enabled: isOpen,
    onLeafChange,
    initialProductCategoryId: product.productCategory?.id ?? null,
  });

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

  const numericPrice = Number(price);
  const valid = useMemo(
    () =>
      name.trim().length > 0 &&
      description.trim().length >= DESCRIPTION_MIN_LENGTH &&
      !Number.isNaN(numericPrice) &&
      numericPrice > 0 &&
      condition !== "" &&
      images.length >= MIN_PRODUCT_IMAGES,
    [name, description, numericPrice, condition, images.length],
  );

  const [submitted, setSubmitted] = useState(false);
  const busy = Boolean(loading) || uploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!valid || busy) return;

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
      toast.error(err instanceof Error ? err.message : t("dashboard.listings.edit.error"));
      return;
    }

    onSave({
      name: name.trim(),
      brand: brand.trim(),
      price: numericPrice,
      description: description.trim(),
      color: color.trim(),
      condition,
      conditionDescription: conditionDescription.trim(),
      isExchangeable,
      interests,
      productCategoryId: productCategoryId ? Number(productCategoryId) : null,
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
          errorMessage={
            submitted && !name.trim() ? t("dashboard.listings.edit.required") : undefined
          }
        />

        {/* Department → category → product type, pre-selected from the listing. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MarketplaceCategoryFields
            categories={categories}
            invalid={submitted && !productCategoryId}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ConditionField
            value={condition}
            onChange={setCondition}
            invalid={submitted && condition === ""}
          />
          <Input
            label={t("dashboard.listings.edit.brand")}
            value={brand}
            onChangeText={setBrand}
          />
        </div>

        <TextArea
          label={t("dashboard.listings.edit.conditionDescription")}
          value={conditionDescription}
          onChangeText={setConditionDescription}
          rows={3}
          maxLength={500}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t("dashboard.listings.edit.color")}
            value={color}
            onChangeText={setColor}
            maxLength={40}
          />
          <Input
            label={t("dashboard.listings.edit.price")}
            value={price}
            onChangeText={(v) => setPrice(v.replace(/[^\d.]/g, ""))}
            leftIcon={DollarSign}
            inputMode="decimal"
            errorMessage={
              submitted && !(numericPrice > 0)
                ? t("dashboard.listings.edit.required")
                : undefined
            }
          />
        </div>

        {/* TextArea carries no error slot, so the message sits beside it —
            same pattern as the publish wizard's DescriptionField. */}
        <div className="flex flex-col gap-1">
          <TextArea
            label={t("dashboard.listings.edit.description")}
            value={description}
            onChangeText={setDescription}
            rows={4}
            maxLength={1000}
          />
          {submitted && description.trim().length < DESCRIPTION_MIN_LENGTH && (
            <Text variant="small" color="error">
              {t("dashboard.listings.edit.descriptionMin", {
                min: String(DESCRIPTION_MIN_LENGTH),
              })}
            </Text>
          )}
        </div>

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

        <ExchangeableField value={isExchangeable} onChange={setIsExchangeable} />
        {isExchangeable && (
          <InterestsField value={interests} onChange={setInterests} />
        )}

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
