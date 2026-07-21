import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getStoreProductDictionary, NAMESPACE } from "../i18n";
import { StoreProductContent } from "../ui/StoreProductContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function StoreProduct({ id, lang }: Props) {
  const dict = await getStoreProductDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <Layout.Container size="default">
          <StoreProductContent id={id} lang={lang} />
        </Layout.Container>
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
