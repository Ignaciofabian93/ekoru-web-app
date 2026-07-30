import { Suspense } from "react";

import { type SupportedLanguage } from "@/constants/settings";
import { PageLayout } from "@/components/Layout";
import { DictionaryProvider } from "@/i18n/context";

import { getCartDictionary, NAMESPACE } from "../i18n";
import { CheckoutScreen } from "../ui/CheckoutScreen";

export async function Checkout({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCartDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <Suspense fallback={<CheckoutFallback />}>
          <CheckoutScreen lang={lang} />
        </Suspense>
      </PageLayout>
    </DictionaryProvider>
  );
}

function CheckoutFallback() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
