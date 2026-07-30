import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";

import { getCartDictionary, NAMESPACE } from "../i18n";
import { CartScreen } from "../ui/CartScreen";

export async function Cart({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCartDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      {/* CartScreen centers itself at max-w-2xl, so the shell stays uncontained. */}
      <PageLayout contained={false}>
        <CartScreen lang={lang} />
      </PageLayout>
    </DictionaryProvider>
  );
}
