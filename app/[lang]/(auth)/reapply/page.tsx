import { type SupportedLanguage } from "@/constants/settings";
import { ReapplyBusiness } from "@/features/auth/screens/ReapplyBusiness";

export default async function ReapplyPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <ReapplyBusiness lang={lang} />;
}
