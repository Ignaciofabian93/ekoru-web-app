import { notFound } from "next/navigation";

import { hasLocale } from "@/constants/settings";
import { StoreProduct } from "@/features/store-product/screens/StoreProduct";

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  if (!id) notFound();

  return <StoreProduct id={id} lang={lang} />;
}
