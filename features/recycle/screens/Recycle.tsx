import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getRecycleDictionary, NAMESPACE } from "../i18n";
import { RecycleContent } from "../ui/RecycleContent";
import { PageLayout } from "@/components/Layout";

export async function Recycle({ lang }: { lang: SupportedLanguage }) {
  const dict = await getRecycleDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <RecycleContent />
      </PageLayout>
    </DictionaryProvider>
  );
}
