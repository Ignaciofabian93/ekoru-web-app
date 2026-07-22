import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunityCategoryContent } from "../ui/CommunityCategoryContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

export async function CommunityCategory({
  lang,
  slug,
}: {
  lang: SupportedLanguage;
  slug: string;
}) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <CommunityCategoryContent lang={lang} language={language} slug={slug} />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
