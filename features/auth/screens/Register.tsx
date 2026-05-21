import { EkoruLogo } from "@/components/EkoruLogo/EkoruLogo";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { RegisterForm } from "../ui/RegisterForm";

export async function Register({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo lang={lang} width={4096} height={996} className="w-48" />}
        subtitleKey="page.registerCta"
        footer={{
          textKey: "actions.hasAccount",
          linkKey: "actions.signIn",
          href: `/${lang}/login`,
        }}
      >
        <RegisterForm />
      </AuthShell>
    </DictionaryProvider>
  );
}
