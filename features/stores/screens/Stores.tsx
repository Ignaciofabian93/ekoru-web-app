import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreHero } from "../ui/StoreHero";
import { StoresContent } from "../ui/StoresContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

export async function Stores({ lang }: { lang: SupportedLanguage }) {
  const dict = await getStoresDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <StoreHero />
        <Layout.Container size="default">
          <StoresContent lang={lang} language={language} />
        </Layout.Container>
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
