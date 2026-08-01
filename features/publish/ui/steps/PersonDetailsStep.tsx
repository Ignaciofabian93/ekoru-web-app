"use client";
import type { MarketplaceCategoriesState } from "../../hooks/useMarketplaceCategories";
import type { PublishForm } from "../../hooks/usePublishForm";

import { BrandField } from "../fields/BrandField";
import { ColorField } from "../fields/ColorField";
import { ConditionDescriptionField } from "../fields/ConditionDescriptionField";
import { ConditionField } from "../fields/ConditionField";
import { DescriptionField } from "../fields/DescriptionField";
import { ImagesField } from "../fields/ImagesField";
import { MarketplaceCategoryFields } from "../fields/MarketplaceCategoryFields";
import { NameField } from "../fields/NameField";

interface PersonDetailsStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  categories: MarketplaceCategoriesState;
  invalid: {
    name: boolean;
    description: boolean;
    category: boolean;
    condition: boolean;
    images: boolean;
  };
  descriptionMinLength: number;
}

/** Details for a second-hand marketplace listing (PERSON sellers). */
export function PersonDetailsStep({
  form,
  setField,
  addImage,
  removeImage,
  categories,
  invalid,
  descriptionMinLength,
}: PersonDetailsStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <NameField
        value={form.name}
        onChange={(v) => setField("name", v)}
        invalid={invalid.name}
      />

      {/* Department → category → product type cascade. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MarketplaceCategoryFields categories={categories} invalid={invalid.category} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ConditionField
          value={form.condition}
          onChange={(v) => setField("condition", v)}
          invalid={invalid.condition}
        />
        <BrandField value={form.brand} onChange={(v) => setField("brand", v)} />
      </div>

      {/* Wear notes sit right under the condition they qualify. */}
      <ConditionDescriptionField
        value={form.conditionDescription}
        onChange={(v) => setField("conditionDescription", v)}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ColorField value={form.color} onChange={(v) => setField("color", v)} />
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
    </div>
  );
}
