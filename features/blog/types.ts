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

export type BlogCategoryTranslation = {
  id: number;
  name: string;
  slug: string;
  description: string;
  href: string | null;
};

/** Shape returned by `getBlogCategoryBySlug` — translated fields are nested under `translation`. */
export type BlogCategoryDetail = {
  id: number;
  icon: string;
  translation: BlogCategoryTranslation | null;
};
