import { hasLocale } from "@/constants/settings";
import { SettingsScreen } from "@/features/profile/screens/Settings";
import { notFound } from "next/navigation";

export default async function Settings({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <SettingsScreen lang={lang} />;
}
