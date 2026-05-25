"use client";
import type { MarketplaceCategoriesState } from "../../hooks/useMarketplaceCategories";
import type { PublishForm } from "../../hooks/usePublish";
import type { ServiceCategoriesState } from "../../hooks/useServiceCategories";
import type { StoreCategoriesState } from "../../hooks/useStoreCategories";
import type { PublishTarget } from "../../constants/options";

import { BrandField } from "../fields/BrandField";
import { ConditionField } from "../fields/ConditionField";
import { DescriptionField } from "../fields/DescriptionField";
import { ImagesField } from "../fields/ImagesField";
import { MarketplaceCategoryFields } from "../fields/MarketplaceCategoryFields";
import { NameField } from "../fields/NameField";
import { ServiceCategoryFields } from "../fields/ServiceCategoryFields";
import { StoreCategoryFields } from "../fields/StoreCategoryFields";

interface DetailsStepProps {
  target: PublishTarget;
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  marketplaceCategories: MarketplaceCategoriesState;
  storeCategories: StoreCategoriesState;
  serviceCategories: ServiceCategoriesState;
  invalid: {
    name: boolean;
    description: boolean;
    category: boolean;
    condition: boolean;
    images: boolean;
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
  invalid,
  descriptionMinLength,
}: DetailsStepProps) {
  const showImages = target === "MARKETPLACE" || target === "STORE";

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

      <DescriptionField
        value={form.description}
        onChange={(v) => setField("description", v)}
        invalid={invalid.description}
        minLength={descriptionMinLength}
      />

      {showImages && (
        <ImagesField
          images={form.images}
          onAdd={addImage}
          onRemove={removeImage}
          invalid={invalid.images}
        />
      )}
    </div>
  );
}
