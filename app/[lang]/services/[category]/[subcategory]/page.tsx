import { hasLocale } from "@/constants/settings";
import { ServiceSubcategory } from "@/features/services/screens/ServiceSubcategory";
import { notFound } from "next/navigation";

export default async function ServiceSubcategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string; subcategory: string }>;
}) {
  const { lang, category, subcategory } = await params;
  if (!hasLocale(lang)) notFound();

  return <ServiceSubcategory lang={lang} categorySlug={category} slug={subcategory} />;
}
