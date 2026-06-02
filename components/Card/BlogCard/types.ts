export type BlogCardData = {
  id: string | number;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  authorName?: string;
  authorAvatar?: string;
  publishedAt?: string;
  readingMinutes?: number;
  tags?: string[];
  likes?: number;
};

export type BlogCardLabels = {
  flipToDetails?: string;
  flipToFront?: string;
  readArticle?: string;
  minRead?: string;
  tags?: string;
  noImage?: string;
  noExcerpt?: string;
};

export const DEFAULT_BLOG_LABELS: Required<BlogCardLabels> = {
  flipToDetails: "Ver detalles",
  flipToFront: "Volver",
  readArticle: "Leer artículo",
  minRead: "min de lectura",
  tags: "Etiquetas",
  noImage: "Sin imagen",
  noExcerpt: "Sin extracto disponible.",
};
