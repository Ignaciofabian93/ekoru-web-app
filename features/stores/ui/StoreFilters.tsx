"use client";
import { Checkbox } from "@/components/Primitives/Checkbox";
import { Input, SearchInput } from "@/components/Primitives/Inputs";
import { Button } from "@/components/Primitives/Button";
import { Modal } from "@/components/Overlays/Modal";
import { Select } from "@/components/Primitives/Select";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { NAMESPACE } from "../i18n";
import {
  EMPTY_FILTERS,
  type StoreFilters as StoreFiltersState,
  type StoreSortValue,
} from "../types";

const SORT_VALUES: StoreSortValue[] = ["newest", "oldest", "priceAsc", "priceDesc"];

/** The subset of filters edited inside the modal (search lives in the bar). */
type FilterDraft = Pick<StoreFiltersState, "minPrice" | "maxPrice" | "onOfferOnly">;

const pickDraft = (f: StoreFiltersState): FilterDraft => ({
  minPrice: f.minPrice,
  maxPrice: f.maxPrice,
  onOfferOnly: f.onOfferOnly,
});

const EMPTY_DRAFT: FilterDraft = pickDraft(EMPTY_FILTERS);

const countActive = (d: FilterDraft) =>
  (d.minPrice ? 1 : 0) + (d.maxPrice ? 1 : 0) + (d.onOfferOnly ? 1 : 0);

interface Props {
  filters: StoreFiltersState;
  sort: StoreSortValue;
  setField: <K extends keyof StoreFiltersState>(
    key: K,
    value: StoreFiltersState[K],
  ) => void;
  setSort: (value: StoreSortValue) => void;
  reset: () => void;
}

export function StoreFilters({ filters, sort, setField, setSort }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterDraft>(pickDraft(filters));

  const activeCount = countActive(pickDraft(filters));

  // Seed the draft from the committed filters when opening, so in-modal edits
  // stay discardable — nothing is applied until the user confirms.
  const openModal = () => {
    setDraft(pickDraft(filters));
    setOpen(true);
  };

  const sortOptions = SORT_VALUES.map((value) => ({
    value,
    label: t(`sort.${value}`),
  }));

  const setDraftField = <K extends keyof FilterDraft>(key: K, value: FilterDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const apply = () => {
    setField("minPrice", draft.minPrice);
    setField("maxPrice", draft.maxPrice);
    setField("onOfferOnly", draft.onOfferOnly);
    setOpen(false);
  };

  const clear = () => setDraft(EMPTY_DRAFT);

  return (
    <section className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
      <div className="flex-1">
        <SearchInput
          size="md"
          width="full"
          value={filters.search}
          onChangeText={(v) => setField("search", v)}
          placeholder={t("filters.searchPlaceholder")}
        />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-full md:w-56">
          <Select
            size="md"
            width="full"
            searchEnabled={false}
            value={sort}
            options={sortOptions}
            onChange={(v) => setSort(v as StoreSortValue)}
            placeholder={t("filters.sortBy")}
          />
        </div>

        <button
          type="button"
          onClick={openModal}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="group flex h-11 shrink-0 items-center gap-2 rounded-md border-2 border-solid border-input-border bg-input-bg px-3 text-base text-foreground outline-none transition-[border-color] duration-150 hover:border-input-border-focus focus-visible:border-input-border-focus"
        >
          <SlidersHorizontal
            size={16}
            strokeWidth={2}
            className="text-foreground-tertiary transition-colors group-hover:text-primary"
          />
          <span className="hidden font-medium sm:inline">{t("filters.title")}</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-on-primary tabular-nums">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t("filters.title")}
        size="lg"
      >
        <div className="flex flex-col gap-6">
          {/* Price range */}
          <div className="flex flex-col gap-2">
            <Text size="sm" weight="medium" color="secondary">
              {t("filters.priceRange")}
            </Text>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                size="md"
                value={draft.minPrice}
                onChangeText={(v) => setDraftField("minPrice", v)}
                placeholder={t("filters.minPrice")}
              />
              <span className="text-foreground-tertiary">–</span>
              <Input
                type="number"
                size="md"
                value={draft.maxPrice}
                onChangeText={(v) => setDraftField("maxPrice", v)}
                placeholder={t("filters.maxPrice")}
              />
            </div>
          </div>

          {/* On offer only */}
          <div className="border-t border-border-light pt-5">
            <Checkbox
              checked={draft.onOfferOnly}
              onCheckedChange={(v) => setDraftField("onOfferOnly", v)}
              label={t("filters.onOfferOnly")}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-border-light pt-5">
            <Button
              text={t("filters.clear")}
              variant="ghost"
              size="md"
              onPress={clear}
            />
            <Button
              text={t("filters.apply")}
              variant="primary"
              size="md"
              onPress={apply}
            />
          </div>
        </div>
      </Modal>
    </section>
  );
}
