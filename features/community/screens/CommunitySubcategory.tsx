import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunitySubcategoryContent } from "../ui/CommunitySubcategoryContent";
import { ScreenShell } from "@/components/Layout/ScreenShell";

export async function CommunitySubcategory({
  lang,
  categorySlug,
  slug,
}: {
  lang: SupportedLanguage;
  categorySlug: string;
  slug: string;
}) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />}>
        <CommunitySubcategoryContent
          lang={lang}
          language={language}
          categorySlug={categorySlug}
          slug={slug}
        />
      </ScreenShell>
    </DictionaryProvider>
  );
}
