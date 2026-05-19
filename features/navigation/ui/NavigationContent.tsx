import { CustomHeader } from "@/components/Header/CustomHeader";
import { EkoruLogo } from "@/components/EkoruLogo/EkoruLogo";
import { type SupportedLanguage } from "@/constants/settings";

export function NavigationContent({ lang }: { lang: SupportedLanguage }) {
  return (
    <CustomHeader
      logo={<EkoruLogo lang={lang} width={4096} height={996} className="w-28" />}
    />
  );
}
