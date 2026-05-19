import { EkoruLogo } from "@/components/EkoruLogo/EkoruLogo";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { LoginForm } from "../ui/LoginForm";

export async function Login({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo lang={lang} width={4096} height={996} className="w-48" />}
        subtitleKey="page.loginSubtitle"
        footer={{ textKey: "actions.noAccount", linkKey: "actions.signUp", href: `/${lang}/register` }}
      >
        <LoginForm />
      </AuthShell>
    </DictionaryProvider>
  );
}
