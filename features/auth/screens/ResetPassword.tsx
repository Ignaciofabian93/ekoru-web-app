import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { Suspense } from "react";
import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { ResetPasswordForm } from "../ui/ResetPasswordForm";
import { EkoruLogo } from "@/components/Primitives/EkoruLogo";

export async function ResetPassword({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo className="w-50" enableRedirection={false} />}
        subtitleKey="page.resetSubtitle"
        footer={{
          textKey: "actions.hasAccount",
          linkKey: "actions.signIn",
          href: `/${lang}/login`,
        }}
      >
        {/* The form reads the token from the query string, so it must sit
            behind Suspense like every other useSearchParams consumer. */}
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </AuthShell>
    </DictionaryProvider>
  );
}
