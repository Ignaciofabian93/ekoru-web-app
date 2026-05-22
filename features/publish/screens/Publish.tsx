import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getPublishDictionary, NAMESPACE } from "../i18n";
import { PublishForm } from "../ui/PublishForm";
import { PublishShell } from "../ui/PublishShell";

export async function Publish({ lang }: { lang: SupportedLanguage }) {
  const dict = await getPublishDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PublishShell nav={<Navigation lang={lang} />}>
        <PublishForm />
      </PublishShell>
    </DictionaryProvider>
  );
}
