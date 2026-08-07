import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getContactDictionary, NAMESPACE } from "../i18n";
import { ContactForm } from "../ui/ContactForm";
import { PageLayout, Section } from "@/components/Layout";

export async function Contact({ lang }: { lang: SupportedLanguage }) {
  const dict = await getContactDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout width="default">
        <Section ariaLabel={NAMESPACE}>
          <ContactForm />
        </Section>
      </PageLayout>
    </DictionaryProvider>
  );
}
