import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { Suspense } from "react";
import { getAuthDictionary, NAMESPACE } from "../i18n";
import { AuthShell } from "../ui/AuthShell";
import { ReapplyBusinessForm } from "../ui/ReapplyBusinessForm";
import { EkoruLogo } from "@/components/Primitives/EkoruLogo";

/** Linked from the rejection email: a rejected business applies again. */
export async function ReapplyBusiness({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <AuthShell
        lang={lang}
        logo={<EkoruLogo className="w-50" enableRedirection={false} />}
        subtitleKey="page.reapplySubtitle"
        footer={{
          textKey: "actions.hasAccount",
          linkKey: "actions.signIn",
          href: `/${lang}/login`,
        }}
      >
        <Suspense>
          <ReapplyBusinessForm />
        </Suspense>
      </AuthShell>
    </DictionaryProvider>
  );
}
