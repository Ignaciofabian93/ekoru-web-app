import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunityContent } from "../ui/CommunityContent";
import { CommunityHero } from "../ui/CommunityHero";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

export async function Community({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <CommunityHero />
        <Layout.Container size="default">
          <CommunityContent lang={lang} language={language} />
        </Layout.Container>
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
