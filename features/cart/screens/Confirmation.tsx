import { Suspense } from "react";

import { type SupportedLanguage } from "@/constants/settings";
import { PageLayout } from "@/components/Layout";
import { DictionaryProvider } from "@/i18n/context";

import { getCartDictionary, NAMESPACE } from "../i18n";
import { ConfirmationScreen } from "../ui/ConfirmationScreen";

export async function Confirmation({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCartDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <Suspense>
          <ConfirmationScreen lang={lang} />
        </Suspense>
      </PageLayout>
    </DictionaryProvider>
  );
}
