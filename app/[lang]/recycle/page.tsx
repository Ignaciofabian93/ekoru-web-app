import { type SupportedLanguage } from "@/constants/settings";
import { Recycle } from "@/features/recycle/screens/Recycle";

export default async function RecyclePage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Recycle lang={lang} />;
}
