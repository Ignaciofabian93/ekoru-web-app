import { hasLocale } from "@/constants/settings";
import { StoreCategory } from "@/features/stores/screens/StoreCategory";
import { notFound } from "next/navigation";

export default async function StoreCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; storeId: string }>;
}) {
  const { lang, storeId } = await params;
  if (!hasLocale(lang)) notFound();

  return <StoreCategory lang={lang} slug={storeId} />;
}
