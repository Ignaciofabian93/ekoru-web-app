import { Suspense } from "react";

import { PageLayout } from "@/components/Layout";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getChatDictionary, NAMESPACE } from "../i18n";
import { MessagesView } from "../ui/MessagesView";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";

/** `/profile/messages`: chat between buyers and sellers (WEB-22). */
export async function MessagesScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getChatDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout width="default">
        <header className="flex flex-col gap-1">
          <Title level="h1" size="h3" weight="bold">
            {dict.title}
          </Title>
          <Text variant="p" color="secondary">
            {dict.subtitle}
          </Text>
        </header>
        {/* useSearchParams needs a Suspense boundary for static rendering. */}
        <Suspense fallback={null}>
          <MessagesView lang={lang} />
        </Suspense>
      </PageLayout>
    </DictionaryProvider>
  );
}
