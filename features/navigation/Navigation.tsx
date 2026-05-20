import { type SupportedLanguage } from "@/constants/settings";
import { getNavigationDictionary, NAMESPACE } from "./i18n";
import { DictionaryProvider } from "@/i18n/context";
import { NavigationContent } from "./ui/NavigationContent";
import { EkoruLogo } from "@/components/EkoruLogo/EkoruLogo";

export async function Navigation({ lang }: { lang: SupportedLanguage }) {
  const dict = await getNavigationDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <NavigationContent
        logo={<EkoruLogo lang={lang} width={4096} height={996} className="w-28" />}
        lang={lang}
      />
    </DictionaryProvider>
  );
}
