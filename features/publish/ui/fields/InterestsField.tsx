"use client";
import { TagsField } from "./TagsField";

/**
 * What the seller will swap their item for. Only meaningful on an exchangeable
 * listing, so callers render it behind `isExchangeable` — an empty list is
 * valid and reads as "open to any offer" on the product card.
 */
export function InterestsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <TagsField
      value={value}
      onChange={onChange}
      name="interests"
      labelKey="form.interests"
      placeholderKey="form.interestsPlaceholder"
      hintKey="form.interestsHint"
      removeAriaKey="form.removeInterest"
      maxItems={8}
    />
  );
}
