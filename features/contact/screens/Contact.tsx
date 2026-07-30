import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getContactDictionary, NAMESPACE } from "../i18n";
import { ContactForm } from "../ui/ContactForm";
import { ContactHero } from "../ui/ContactHero";
import { PageLayout } from "@/components/Layout";

export async function Contact({ lang }: { lang: SupportedLanguage }) {
  const dict = await getContactDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ContactHero />} width="narrow">
        <ContactForm />
      </PageLayout>
    </DictionaryProvider>
  );
}
