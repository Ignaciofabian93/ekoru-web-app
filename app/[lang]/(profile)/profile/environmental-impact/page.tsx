import { hasLocale } from "@/constants/settings";
import { EnvironmentalImpactScreen } from "@/features/profile/screens/EnvironmentalImpact";
import { notFound } from "next/navigation";

export default async function EnvironmentalImpact({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <EnvironmentalImpactScreen lang={lang} />;
}
