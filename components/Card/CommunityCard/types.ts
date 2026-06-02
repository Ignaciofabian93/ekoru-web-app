export type CommunityCardKind = "post" | "event";

export type CommunityCardData = {
  id: string | number;
  kind?: CommunityCardKind;
  title: string;
  excerpt?: string;
  image?: string;
  authorName?: string;
  authorAvatar?: string;
  createdAt?: string;
  likes?: number;
  comments?: number;
  attendees?: number;
  capacity?: number;
  date?: string;
  location?: string;
  isOnline?: boolean;
  tags?: string[];
};

export type CommunityCardLabels = {
  flipToDetails?: string;
  flipToFront?: string;
  joinDiscussion?: string;
  viewPost?: string;
  viewEvent?: string;
  attending?: string;
  online?: string;
  tags?: string;
  noImage?: string;
  noExcerpt?: string;
};

export const DEFAULT_COMMUNITY_LABELS: Required<CommunityCardLabels> = {
  flipToDetails: "Ver detalles",
  flipToFront: "Volver",
  joinDiscussion: "Unirse a la conversación",
  viewPost: "Ver publicación",
  viewEvent: "Ver evento",
  attending: "asistentes",
  online: "Online",
  tags: "Etiquetas",
  noImage: "Sin imagen",
  noExcerpt: "Sin descripción disponible.",
};
