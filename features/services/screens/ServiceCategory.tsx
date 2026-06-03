import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServiceCategoryContent } from "../ui/ServiceCategoryContent";
import { ScreenShell } from "@/components/Layout/ScreenShell";

export async function ServiceCategory({
  lang,
  slug,
}: {
  lang: SupportedLanguage;
  slug: string;
}) {
  const dict = await getServicesDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />}>
        <ServiceCategoryContent lang={lang} language={language} slug={slug} />
      </ScreenShell>
    </DictionaryProvider>
  );
}
