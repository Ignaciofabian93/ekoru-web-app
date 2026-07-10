import { type SupportedLanguage } from "@/constants/settings";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getRecycleDictionary, NAMESPACE } from "../i18n";
import { RecycleContent } from "../ui/RecycleContent";

export async function Recycle({ lang }: { lang: SupportedLanguage }) {
  const dict = await getRecycleDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />}>
        <RecycleContent />
      </ScreenShell>
    </DictionaryProvider>
  );
}
