export type ServiceCardData = {
  id: string | number;
  name: string;
  providerName?: string;
  providerLogo?: string;
  description?: string;
  image?: string;
  category?: string;
  city?: string;
  address?: string;
  priceFrom?: number;
  durationMinutes?: number;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
  includes?: string[];
};

export type ServiceCardLabels = {
  flipToDetails?: string;
  flipToFront?: string;
  bookNow?: string;
  contactProvider?: string;
  verified?: string;
  reviews?: string;
  priceFromPrefix?: string;
  duration?: string;
  includes?: string;
  minutesShort?: string;
  hoursShort?: string;
  noImage?: string;
  noDescription?: string;
};

export const DEFAULT_SERVICE_LABELS: Required<ServiceCardLabels> = {
  flipToDetails: "Ver detalles",
  flipToFront: "Volver",
  bookNow: "Reservar",
  contactProvider: "Contactar",
  verified: "Verificado",
  reviews: "reseñas",
  priceFromPrefix: "Desde",
  duration: "Duración",
  includes: "Incluye",
  minutesShort: "min",
  hoursShort: "h",
  noImage: "Sin imagen",
  noDescription: "Este servicio aún no tiene descripción.",
};
