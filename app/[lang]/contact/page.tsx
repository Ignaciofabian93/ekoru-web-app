import { type SupportedLanguage } from "@/constants/settings";
import { Contact } from "@/features/contact/screens/Contact";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Contact lang={lang} />;
}
