"use client";
import type { MarketplaceCategoriesState } from "../../hooks/useMarketplaceCategories";
import type { MaterialsState } from "../../hooks/useMaterials";
import type { PublishForm } from "../../hooks/usePublish";
import type { ServiceCategoriesState } from "../../hooks/useServiceCategories";
import type { StoreCategoriesState } from "../../hooks/useStoreCategories";
import type { PublishTarget } from "../../constants/options";

import { BrandField } from "../fields/BrandField";
import { ColorField } from "../fields/ColorField";
import { ConditionField } from "../fields/ConditionField";
import { DescriptionField } from "../fields/DescriptionField";
import { DimensionsField } from "../fields/DimensionsField";
import { ImagesField } from "../fields/ImagesField";
import { MarketplaceCategoryFields } from "../fields/MarketplaceCategoryFields";
import { MaterialCompositionField } from "../fields/MaterialCompositionField";
import { NameField } from "../fields/NameField";
import { OptionalDetailsSection } from "../fields/OptionalDetailsSection";
import { RecycledContentField } from "../fields/RecycledContentField";
import { ServiceCategoryFields } from "../fields/ServiceCategoryFields";
import { StoreCategoryFields } from "../fields/StoreCategoryFields";
import { TagsField } from "../fields/TagsField";
import { WarrantyField } from "../fields/WarrantyField";
import { WeightField } from "../fields/WeightField";

interface DetailsStepProps {
  target: PublishTarget;
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  marketplaceCategories: MarketplaceCategoriesState;
  storeCategories: StoreCategoriesState;
  serviceCategories: ServiceCategoriesState;
  materials: MaterialsState;
  invalid: {
    name: boolean;
    description: boolean;
    category: boolean;
    condition: boolean;
    images: boolean;
    materials: boolean;
  };
  descriptionMinLength: number;
}

export function DetailsStep({
  target,
  form,
  setField,
  addImage,
  removeImage,
  marketplaceCategories,
  storeCategories,
  serviceCategories,
  materials,
  invalid,
  descriptionMinLength,
}: DetailsStepProps) {
  // Photos apply to every target. Products require at least one (enforced in
  // usePublish validation); services keep them optional.
  return (
    <div className="flex flex-col gap-5">
      <NameField
        value={form.name}
        onChange={(v) => setField("name", v)}
        invalid={invalid.name}
      />

      {target === "MARKETPLACE" && (
        <MarketplaceCategoryFields
          categories={marketplaceCategories}
          invalid={invalid.category}
        />
      )}

      {target === "STORE" && (
        <StoreCategoryFields
          categories={storeCategories}
          invalid={invalid.category}
        />
      )}

      {target === "SERVICE" && (
        <ServiceCategoryFields
          categories={serviceCategories}
          invalid={invalid.category}
        />
      )}

      {target === "MARKETPLACE" && (
        <ConditionField
          value={form.condition}
          onChange={(v) => setField("condition", v)}
          invalid={invalid.condition}
        />
      )}

      {(target === "MARKETPLACE" || target === "STORE") && (
        <BrandField value={form.brand} onChange={(v) => setField("brand", v)} />
      )}

      {target === "STORE" && (
        <ColorField value={form.color} onChange={(v) => setField("color", v)} />
      )}

      {target === "STORE" && (
        <>
          <MaterialCompositionField
            value={form.materials}
            onChange={(v) => setField("materials", v)}
            options={materials.options}
            loading={materials.loading}
            invalid={invalid.materials}
          />
          <RecycledContentField
            value={form.recycledContent}
            onChange={(v) => setField("recycledContent", v)}
          />
        </>
      )}

      <DescriptionField
        value={form.description}
        onChange={(v) => setField("description", v)}
        invalid={invalid.description}
        minLength={descriptionMinLength}
      />

      {target === "SERVICE" && (
        <TagsField value={form.tags} onChange={(v) => setField("tags", v)} />
      )}

      <ImagesField
        images={form.images}
        onAdd={addImage}
        onRemove={removeImage}
        invalid={invalid.images}
      />

      {target === "STORE" && (
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
      )}
    </div>
  );
}
