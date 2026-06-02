import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreCategoryContent } from "../ui/StoreCategoryContent";
import { StoreShell } from "../ui/StoreShell";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export async function StoreCategory({ lang, slug }: Props) {
  const dict = await getStoresDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <StoreShell nav={<Navigation lang={lang} />}>
        <StoreCategoryContent lang={lang} language={language} slug={slug} />
      </StoreShell>
    </DictionaryProvider>
  );
}
