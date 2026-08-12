import { type SupportedLanguage } from "@/constants/settings";
import { ResetPassword } from "@/features/auth/screens/ResetPassword";

/**
 * Target of the link in the password-reset email
 * (`/{lang}/reset-password?token=…`). Public: the token is the credential.
 */
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <ResetPassword lang={lang} />;
}
