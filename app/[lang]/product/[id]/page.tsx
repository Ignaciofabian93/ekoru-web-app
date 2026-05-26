import { notFound } from "next/navigation";

import { hasLocale } from "@/constants/settings";
import { Product } from "@/features/product/screens/Product";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  if (!id) notFound();

  return <Product id={id} lang={lang} />;
}
