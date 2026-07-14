import { hasLocale } from "@/constants/settings";
import { StoreSubCategory } from "@/features/stores/screens/StoreSubCategory";
import { notFound } from "next/navigation";

export default async function StoreSubCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; storeId: string; subcategory: string }>;
}) {
  const { lang, storeId, subcategory } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <StoreSubCategory
      lang={lang}
      categorySlug={storeId}
      subCategorySlug={subcategory}
    />
  );
}
