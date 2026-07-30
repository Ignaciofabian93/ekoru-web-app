import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { Suspense } from "react";
import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { LoginForm } from "../ui/LoginForm";
import { EkoruLogo } from "@/components/Primitives/EkoruLogo";

export async function Login({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo className="w-50" enableRedirection={false} />}
        subtitleKey="page.loginSubtitle"
        footer={{
          textKey: "actions.noAccount",
          linkKey: "actions.signUp",
          href: `/${lang}/register`,
        }}
      >
        <Suspense>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </DictionaryProvider>
  );
}
