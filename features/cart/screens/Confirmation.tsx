import { Suspense } from "react";

import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getCartDictionary, NAMESPACE } from "../i18n";
import { ConfirmationScreen } from "../ui/ConfirmationScreen";

export async function Confirmation({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCartDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <main className="flex flex-1 flex-col">
        <Navigation lang={lang} />
        <Suspense>
          <ConfirmationScreen lang={lang} />
        </Suspense>
      </main>
    </DictionaryProvider>
  );
}
