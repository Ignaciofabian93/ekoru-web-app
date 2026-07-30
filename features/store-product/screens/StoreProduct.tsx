import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getStoreProductDictionary, NAMESPACE } from "../i18n";
import { StoreProductContent } from "../ui/StoreProductContent";
import { PageLayout } from "@/components/Layout";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function StoreProduct({ id, lang }: Props) {
  const dict = await getStoreProductDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout width="default">
        <StoreProductContent id={id} lang={lang} />
      </PageLayout>
    </DictionaryProvider>
  );
}
