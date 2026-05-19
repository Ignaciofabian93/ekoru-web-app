import { DictionaryProvider } from "@/i18n/context";
import { type SupportedLanguage } from "@/constants/settings";
import { getEkoruLogoDictionary, NAMESPACE } from "./i18n";
import { EkoruLogoContent } from "./ui/EkoruLogoContent";

interface EkoruLogoProps {
  className?: string;
  width: number;
  height: number;
  onClick?: () => void;
}

export async function EkoruLogo({
  lang,
  ...ekoruProps
}: { lang: SupportedLanguage } & EkoruLogoProps) {
  const dict = await getEkoruLogoDictionary(lang);
  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <EkoruLogoContent {...ekoruProps} />
    </DictionaryProvider>
  );
}
