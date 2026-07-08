"use client";
import type { PublishForm } from "../../hooks/usePublishForm";
import type { ServiceCategoriesState } from "../../hooks/useServiceCategories";

import { DescriptionField } from "../fields/DescriptionField";
import { ImagesField } from "../fields/ImagesField";
import { NameField } from "../fields/NameField";
import { ServiceCategoryFields } from "../fields/ServiceCategoryFields";
import { TagsField } from "../fields/TagsField";

interface ServiceDetailsStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  categories: ServiceCategoriesState;
  invalid: {
    name: boolean;
    category: boolean;
  };
  descriptionMinLength: number;
}

/** Details for a new service (SERVICES / MIXED businesses). Description,
 *  tags and photos are optional for services. */
export function ServiceDetailsStep({
  form,
  setField,
  addImage,
  removeImage,
  categories,
  invalid,
  descriptionMinLength,
}: ServiceDetailsStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <NameField
        value={form.name}
        onChange={(v) => setField("name", v)}
        invalid={invalid.name}
      />

      {/* Service category → type cascade. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ServiceCategoryFields categories={categories} invalid={invalid.category} />
      </div>

      <DescriptionField
        value={form.description}
        onChange={(v) => setField("description", v)}
        invalid={false}
        minLength={descriptionMinLength}
      />

      <TagsField value={form.tags} onChange={(v) => setField("tags", v)} />

      <ImagesField
        images={form.images}
        onAdd={addImage}
        onRemove={removeImage}
        invalid={false}
      />
    </div>
  );
}
