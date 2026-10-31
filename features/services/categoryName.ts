type ServiceCategoryRef =
  | {
      subCategory?: string | null;
      translation?: { subCategory?: string | null } | null;
    }
  | null
  | undefined;

/**
 * A service's sub-category name for a card. The name lives on the translation;
 * the bare `subCategory` field is often empty, and a card that read only it
 * showed every service as "no brand".
 */
export function serviceCategoryName(category: ServiceCategoryRef): string | undefined {
  return category?.translation?.subCategory ?? category?.subCategory ?? undefined;
}
