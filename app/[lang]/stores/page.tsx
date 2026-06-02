import { hasLocale } from "@/constants/settings";
import { Stores } from "@/features/stores/screens/Stores";
import { notFound } from "next/navigation";

export default async function StoresPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Stores lang={lang} />;
}
