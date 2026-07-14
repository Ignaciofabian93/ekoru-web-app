import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServiceSubcategoryContent } from "../ui/ServiceSubcategoryContent";
import { ScreenShell } from "@/components/Layout/ScreenShell";

export async function ServiceSubcategory({
  lang,
  categorySlug,
  slug,
}: {
  lang: SupportedLanguage;
  categorySlug: string;
  slug: string;
}) {
  const dict = await getServicesDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />}>
        <ServiceSubcategoryContent
          lang={lang}
          categorySlug={categorySlug}
          slug={slug}
        />
      </ScreenShell>
    </DictionaryProvider>
  );
}
