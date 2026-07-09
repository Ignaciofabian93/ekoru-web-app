import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getStoreProductDictionary, NAMESPACE } from "../i18n";
import { StoreProductContent } from "../ui/StoreProductContent";
import { StoreProductShell } from "../ui/StoreProductShell";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function StoreProduct({ id, lang }: Props) {
  const dict = await getStoreProductDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <StoreProductShell nav={<Navigation lang={lang} />}>
        <StoreProductContent id={id} lang={lang} />
      </StoreProductShell>
    </DictionaryProvider>
  );
}
