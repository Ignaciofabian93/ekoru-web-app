import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import type { Language } from "@/graphql/enums/enums";
import { DictionaryProvider } from "@/i18n/context";

import { getSearchDictionary, NAMESPACE } from "../i18n";
import { SearchContent } from "../ui/SearchContent";
import { SearchShell } from "../ui/SearchShell";

export async function Search({
  lang,
  query,
}: {
  lang: SupportedLanguage;
  query: string;
}) {
  const dict = await getSearchDictionary(lang);
  const language = lang.toUpperCase() as Language;

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <SearchShell nav={<Navigation lang={lang} />}>
        <SearchContent key={query} lang={lang} language={language} query={query} />
      </SearchShell>
    </DictionaryProvider>
  );
}
