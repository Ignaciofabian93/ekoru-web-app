import { type SupportedLanguage } from "@/constants/settings";
import type { Language } from "@/graphql/enums/enums";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { getSearchDictionary, NAMESPACE } from "../i18n";
import { SearchContent } from "../ui/SearchContent";
import { PageLayout } from "@/components/Layout";

export async function Search({
  lang,
  query,
}: {
  lang: SupportedLanguage;
  query: string;
}) {
  // The result grid renders domain cards (marketplace/store), which read their
  // labels from the marketplace namespace.
  const [dict, marketplaceDict] = await Promise.all([
    getSearchDictionary(lang),
    getMarketplaceDictionary(lang),
  ]);
  const language = lang.toUpperCase() as Language;

  return (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: dict, [MARKETPLACE_NAMESPACE]: marketplaceDict }}
    >
      <PageLayout width="default">
        <SearchContent key={query} lang={lang} language={language} query={query} />
      </PageLayout>
    </DictionaryProvider>
  );
}
