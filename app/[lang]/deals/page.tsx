import { notFound } from "next/navigation";

import { hasLocale, type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";
import { getDealsDictionary, NAMESPACE } from "@/features/deals/i18n";
import { DealsScreen } from "@/features/deals/ui/DealsScreen";

export default async function DealsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDealsDictionary(lang as SupportedLanguage);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <DealsScreen />
      </PageLayout>
    </DictionaryProvider>
  );
}
