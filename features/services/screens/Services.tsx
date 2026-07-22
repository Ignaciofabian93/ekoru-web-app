import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServicesContent } from "../ui/ServicesContent";
import { ServicesHero } from "../ui/ServicesHero";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

export async function Services({ lang }: { lang: SupportedLanguage }) {
  const dict = await getServicesDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <ServicesHero />
        <Layout.Container size="default">
          <ServicesContent lang={lang} language={language} />
        </Layout.Container>
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
