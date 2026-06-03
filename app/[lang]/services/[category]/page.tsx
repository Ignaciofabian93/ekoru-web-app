import { hasLocale } from "@/constants/settings";
import { ServiceCategory } from "@/features/services/screens/ServiceCategory";
import { notFound } from "next/navigation";

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;
  if (!hasLocale(lang)) notFound();

  return <ServiceCategory lang={lang} slug={category} />;
}
