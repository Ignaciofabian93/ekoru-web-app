import { type SupportedLanguage } from "@/constants/settings";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getContactDictionary, NAMESPACE } from "../i18n";
import { ContactForm } from "../ui/ContactForm";
import { ContactHero } from "../ui/ContactHero";

export async function Contact({ lang }: { lang: SupportedLanguage }) {
  const dict = await getContactDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ContactHero />}>
        <ContactForm />
      </ScreenShell>
    </DictionaryProvider>
  );
}
