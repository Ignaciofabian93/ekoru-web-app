export type Language = "ES" | "EN" | "FR";

export type BlogCatalogCategory = {
  id: number;
  /** Icon name as returned by the API (mapped to a lucide icon in `constants/icons`). */
  icon: string;
  name: string;
  description: string;
  slug: string;
  href: string;
};
