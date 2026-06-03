import { hasLocale } from "@/constants/settings";
import { Services } from "@/features/services/screens/Services";
import { notFound } from "next/navigation";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Services lang={lang} />;
}
