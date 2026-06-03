import { hasLocale } from "@/constants/settings";
import { CommunitySubcategory } from "@/features/community/screens/CommunitySubcategory";
import { notFound } from "next/navigation";

export default async function CommunitySubcategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string; subcategory: string }>;
}) {
  const { lang, category, subcategory } = await params;
  if (!hasLocale(lang)) notFound();

  return <CommunitySubcategory lang={lang} categorySlug={category} slug={subcategory} />;
}
