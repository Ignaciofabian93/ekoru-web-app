import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getBlogDictionary, NAMESPACE } from "../i18n";
import { BlogContent } from "../ui/BlogContent";
import { BlogHero } from "../ui/BlogHero";
import { ScreenShell } from "@/components/Layout/ScreenShell";

export async function Blog({ lang }: { lang: SupportedLanguage }) {
  const dict = await getBlogDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<BlogHero />}>
        <BlogContent lang={lang} language={language} />
      </ScreenShell>
    </DictionaryProvider>
  );
}
