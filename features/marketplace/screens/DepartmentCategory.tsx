import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { DepartmentCategoryContent } from "../ui/DepartmentCategoryContent";
import { MarketplaceShell } from "../ui/MarketplaceShell";

interface Props {
  lang: SupportedLanguage;
  departmentSlug: string;
  categorySlug: string;
}

export async function DepartmentCategory({
  lang,
  departmentSlug,
  categorySlug,
}: Props) {
  const dict = await getMarketplaceDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <MarketplaceShell nav={<Navigation lang={lang} />}>
        <DepartmentCategoryContent
          lang={lang}
          language={language}
          departmentSlug={departmentSlug}
          categorySlug={categorySlug}
        />
      </MarketplaceShell>
    </DictionaryProvider>
  );
}
