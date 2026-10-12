import { hasLocale } from "@/constants/settings";
import { SalesScreen } from "@/features/profile/screens/Sales";
import { notFound } from "next/navigation";

export default async function Sales({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <SalesScreen lang={lang} />;
}
