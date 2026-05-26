import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getProductDictionary, NAMESPACE } from "../i18n";
import { ProductContent } from "../ui/ProductContent";
import { ProductShell } from "../ui/ProductShell";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function Product({ id, lang }: Props) {
  const dict = await getProductDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ProductShell nav={<Navigation lang={lang} />}>
        <ProductContent id={id} lang={lang} />
      </ProductShell>
    </DictionaryProvider>
  );
}
