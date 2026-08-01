"use client";
import type {
  DimensionUnit,
  ProductCondition,
  ServicePricing,
  WeightUnit,
} from "@/types/enums";
import { useCallback, useState } from "react";

import { MAX_PRODUCT_IMAGES } from "../constants/options";

export interface PublishForm {
  name: string;
  description: string;
  brand: string;
  // Marketplace leaf — set by useMarketplaceCategories cascade.
  productCategoryId: string;
  // Store leaf — set by useStoreCategories cascade.
  storeSubCategoryId: string;
  // Service leaf — set by useServiceCategories cascade.
  serviceSubcategoryId: string;
  condition: ProductCondition | "";
  conditionDescription: string;
  price: string;
  stock: string;
  sku: string;
  // Store-only product attributes (all optional in the stores subgraph).
  barcode: string;
  color: string;
  hasOffer: boolean;
  offerPrice: string;
  recycledContent: string; // percentage
  weight: string;
  weightUnit: WeightUnit | "";
  length: string;
  width: string;
  height: string;
  dimensionUnit: DimensionUnit | "";
  lowStockThreshold: string;
  // Whether the product includes a warranty (null = not answered yet).
  warranty: boolean | null;
  warrantyDuration: string; // months
  features: string[];
  // Structured material composition: each row is one material + its percentage.
  materials: { materialTypeId: string; percentage: string }[];
  servicePricing: ServicePricing | "";
  isExchangeable: boolean;
  /** Marketplace only — what the seller will swap for. Empty = any offer. */
  interests: string[];
  images: File[];
  // Service-only fields (persisted by the services subgraph today).
  tags: string[];
  duration: string; // minutes
  priceRange: string; // free text, e.g. "50.000–150.000 CLP"
}

const INITIAL_FORM: PublishForm = {
  name: "",
  description: "",
  brand: "",
  productCategoryId: "",
  storeSubCategoryId: "",
  serviceSubcategoryId: "",
  condition: "",
  conditionDescription: "",
  price: "",
  stock: "",
  sku: "",
  barcode: "",
  color: "",
  hasOffer: false,
  offerPrice: "",
  recycledContent: "",
  weight: "",
  weightUnit: "",
  length: "",
  width: "",
  height: "",
  dimensionUnit: "",
  lowStockThreshold: "",
  warranty: null,
  warrantyDuration: "",
  features: [],
  materials: [{ materialTypeId: "", percentage: "" }],
  servicePricing: "",
  isExchangeable: false,
  interests: [],
  images: [],
  tags: [],
  duration: "",
  priceRange: "",
};

/** Shared field state for the publish wizards: one flat form object with typed
 *  setters and image helpers. Publishing itself lives in usePersonPublish /
 *  useBusinessPublish. */
export function usePublishForm() {
  const [form, setForm] = useState<PublishForm>(INITIAL_FORM);

  const setField = useCallback(
    <K extends keyof PublishForm>(key: K, value: PublishForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const addImage = useCallback(
    (file: File) =>
      setForm((prev) =>
        prev.images.length >= MAX_PRODUCT_IMAGES
          ? prev
          : { ...prev, images: [...prev.images, file] },
      ),
    [],
  );

  const removeImage = useCallback(
    (index: number) =>
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      })),
    [],
  );

  return { form, setField, addImage, removeImage };
}
