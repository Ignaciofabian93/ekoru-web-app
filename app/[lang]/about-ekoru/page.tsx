import { type SupportedLanguage } from "@/constants/settings";
import { AboutEkoru } from "@/features/about-ekoru/screens/AboutEkoru";

export default async function AboutEkoruPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <AboutEkoru lang={lang} />;
}
