"use client";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";
import { X } from "lucide-react";
import { useState } from "react";

/** Keep the tag set small so listings stay scannable. */
const MAX_TAGS = 10;

export function TagsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const { t } = useTranslation("publish");
  const [draft, setDraft] = useState("");

  const atMax = value.length >= MAX_TAGS;

  const commit = () => {
    const tag = draft.trim().replace(/,+$/, "").trim();
    setDraft("");
    if (!tag || atMax) return;
    // Case-insensitive de-dupe so "Logo" and "logo" don't both land.
    const exists = value.some((v) => v.toLowerCase() === tag.toLowerCase());
    if (!exists) onChange([...value, tag]);
  };

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      removeAt(value.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        name="tags"
        label={t("form.tags")}
        placeholder={t("form.tagsPlaceholder")}
        value={draft}
        onChangeText={setDraft}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        maxLength={30}
        disabled={atMax}
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 rounded-full border border-border-light bg-primary-light-bg py-1 pl-3 pr-1.5"
            >
              <Text variant="small" color="primary">
                {tag}
              </Text>
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={t("form.removeTag")}
                className="flex items-center text-foreground-tertiary transition-colors hover:text-danger"
              >
                <X size={13} color="currentColor" strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      <Text variant="small" color="tertiary">
        {t("form.tagsHint")}
      </Text>
    </div>
  );
}
