import { notFound } from "next/navigation";

import { hasLocale, type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getImpactDictionary, NAMESPACE } from "@/features/impact/i18n";
import { EnvironmentalImpactScreen } from "@/features/impact/screens/EnvironmentalImpactScreen";

export default async function EnvironmentalImpact({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getImpactDictionary(lang as SupportedLanguage);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <EnvironmentalImpactScreen />
    </DictionaryProvider>
  );
}
