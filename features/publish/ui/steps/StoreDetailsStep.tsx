"use client";
import type { MaterialsState } from "../../hooks/useMaterials";
import type { PublishForm } from "../../hooks/usePublishForm";
import type { StoreCategoriesState } from "../../hooks/useStoreCategories";

import { BrandField } from "../fields/BrandField";
import { ColorField } from "../fields/ColorField";
import { DescriptionField } from "../fields/DescriptionField";
import { DimensionsField } from "../fields/DimensionsField";
import { ImagesField } from "../fields/ImagesField";
import { MaterialCompositionField } from "../fields/MaterialCompositionField";
import { NameField } from "../fields/NameField";
import { OptionalDetailsSection } from "../fields/OptionalDetailsSection";
import { RecycledContentField } from "../fields/RecycledContentField";
import { StoreCategoryFields } from "../fields/StoreCategoryFields";
import { TagsField } from "../fields/TagsField";
import { WarrantyField } from "../fields/WarrantyField";
import { WeightField } from "../fields/WeightField";

interface StoreDetailsStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  categories: StoreCategoriesState;
  materials: MaterialsState;
  invalid: {
    name: boolean;
    description: boolean;
    category: boolean;
    images: boolean;
    materials: boolean;
  };
  descriptionMinLength: number;
}

/** Details for a new store product (RETAIL / MIXED businesses). */
export function StoreDetailsStep({
  form,
  setField,
  addImage,
  removeImage,
  categories,
  materials,
  invalid,
  descriptionMinLength,
}: StoreDetailsStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <NameField
        value={form.name}
        onChange={(v) => setField("name", v)}
        invalid={invalid.name}
      />

      {/* Store category → subcategory cascade. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StoreCategoryFields categories={categories} invalid={invalid.category} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <BrandField value={form.brand} onChange={(v) => setField("brand", v)} />
        <ColorField value={form.color} onChange={(v) => setField("color", v)} />
      </div>

      <MaterialCompositionField
        value={form.materials}
        onChange={(v) => setField("materials", v)}
        options={materials.options}
        loading={materials.loading}
        invalid={invalid.materials}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <RecycledContentField
          value={form.recycledContent}
          onChange={(v) => setField("recycledContent", v)}
        />
      </div>

      <DescriptionField
        value={form.description}
        onChange={(v) => setField("description", v)}
        invalid={invalid.description}
        minLength={descriptionMinLength}
      />

      <ImagesField
        images={form.images}
        onAdd={addImage}
        onRemove={removeImage}
        invalid={invalid.images}
      />

      <OptionalDetailsSection>
        <WeightField
          value={form.weight}
          unit={form.weightUnit}
          onChangeValue={(v) => setField("weight", v)}
          onChangeUnit={(v) => setField("weightUnit", v)}
        />
        <DimensionsField
          length={form.length}
          width={form.width}
          height={form.height}
          unit={form.dimensionUnit}
          onChangeLength={(v) => setField("length", v)}
          onChangeWidth={(v) => setField("width", v)}
          onChangeHeight={(v) => setField("height", v)}
          onChangeUnit={(v) => setField("dimensionUnit", v)}
        />
        <WarrantyField
          value={form.warranty}
          duration={form.warrantyDuration}
          onChangeValue={(v) => setField("warranty", v)}
          onChangeDuration={(v) => setField("warrantyDuration", v)}
        />
        <TagsField
          value={form.features}
          onChange={(v) => setField("features", v)}
          name="features"
          labelKey="form.features"
          placeholderKey="form.featuresPlaceholder"
          hintKey="form.featuresHint"
          removeAriaKey="form.removeFeature"
        />
        <TagsField value={form.tags} onChange={(v) => setField("tags", v)} />
      </OptionalDetailsSection>
    </div>
  );
}
