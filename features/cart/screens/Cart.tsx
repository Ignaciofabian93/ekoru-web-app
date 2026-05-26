import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getCartDictionary, NAMESPACE } from "../i18n";
import { CartScreen } from "../ui/CartScreen";

export async function Cart({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCartDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <main className="flex flex-1 flex-col">
        <Navigation lang={lang} />
        <CartScreen lang={lang} />
      </main>
    </DictionaryProvider>
  );
}
