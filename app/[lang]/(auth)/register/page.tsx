import { type SupportedLanguage } from "@/constants/settings";
import { Register } from "@/features/auth/screens/Register";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Register lang={lang} />;
}
