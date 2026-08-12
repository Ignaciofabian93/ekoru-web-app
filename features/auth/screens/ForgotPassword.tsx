import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { Suspense } from "react";
import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { ForgotPasswordForm } from "../ui/ForgotPasswordForm";
import { EkoruLogo } from "@/components/Primitives/EkoruLogo";

export async function ForgotPassword({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo className="w-50" enableRedirection={false} />}
        subtitleKey="page.forgotSubtitle"
        footer={{
          textKey: "actions.hasAccount",
          linkKey: "actions.signIn",
          href: `/${lang}/login`,
        }}
      >
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </AuthShell>
    </DictionaryProvider>
  );
}
