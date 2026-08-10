import { notFound } from "next/navigation";

import { hasLocale } from "@/constants/settings";
import { Service } from "@/features/service/screens/Service";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  if (!id) notFound();

  return <Service id={id} lang={lang} />;
}
