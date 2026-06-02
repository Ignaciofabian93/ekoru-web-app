import type { BusinessType } from "@/types/enums";

export type StoreCardData = {
  id: string | number;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  businessType?: BusinessType;
  address?: string;
  city?: string;
  phone?: string;
  productCount?: number;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
  hoursToday?: string;
};

export type StoreCardLabels = {
  flipToDetails?: string;
  flipToFront?: string;
  visitStore?: string;
  verified?: string;
  products?: string;
  reviews?: string;
  hoursToday?: string;
  noCoverImage?: string;
  noDescription?: string;
  businessType?: Partial<Record<BusinessType, string>>;
};

export const DEFAULT_STORE_LABELS: Required<Omit<StoreCardLabels, "businessType">> & {
  businessType: Required<Record<BusinessType, string>>;
} = {
  flipToDetails: "Ver detalles",
  flipToFront: "Volver",
  visitStore: "Visitar tienda",
  verified: "Verificada",
  products: "productos",
  reviews: "reseñas",
  hoursToday: "Hoy",
  noCoverImage: "Sin imagen",
  noDescription: "Esta tienda aún no tiene descripción.",
  businessType: {
    RETAIL: "Retail",
    SERVICES: "Servicios",
    MIXED: "Mixto",
  },
};
