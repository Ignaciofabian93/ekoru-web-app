import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";

import { getServiceDictionary, NAMESPACE } from "../i18n";
import { ServiceContent } from "../ui/ServiceContent";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function Service({ id, lang }: Props) {
  const dict = await getServiceDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout width="default">
        <ServiceContent id={id} lang={lang} />
      </PageLayout>
    </DictionaryProvider>
  );
}
