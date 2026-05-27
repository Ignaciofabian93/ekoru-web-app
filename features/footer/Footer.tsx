import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getFooterDictionary, NAMESPACE } from "./i18n";
import { FooterContent } from "./ui/FooterContent";

export async function Footer({ lang }: { lang: SupportedLanguage }) {
  const dict = await getFooterDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <FooterContent />
    </DictionaryProvider>
  );
}
