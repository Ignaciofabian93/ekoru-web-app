import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { RegisterForm } from "../ui/RegisterForm";
import { EkoruLogo } from "@/components/Primitives/EkoruLogo";

export async function Register({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo className="w-50" enableRedirection={false} />}
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
