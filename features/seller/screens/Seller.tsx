import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getSellerDictionary, NAMESPACE } from "../i18n";
import { SellerContent } from "../ui/SellerContent";
import { SellerShell } from "../ui/SellerShell";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function Seller({ id, lang }: Props) {
  const dict = await getSellerDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <SellerShell nav={<Navigation lang={lang} />}>
        <SellerContent id={id} lang={lang} />
      </SellerShell>
    </DictionaryProvider>
  );
}
