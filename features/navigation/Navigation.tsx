import { type SupportedLanguage } from "@/constants/settings";
import { getNavigationDictionary, NAMESPACE } from "./i18n";
import { DictionaryProvider } from "@/i18n/context";
import { NavigationContent } from "./ui/NavigationContent";

export async function Navigation({ lang }: { lang: SupportedLanguage }) {
  const dict = await getNavigationDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <NavigationContent lang={lang} />
    </DictionaryProvider>
  );
}
