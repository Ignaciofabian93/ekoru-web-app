import { hasLocale } from "@/constants/settings";
import { ProfileScreen } from "@/features/profile/screens/Profile";
import { notFound } from "next/navigation";

export default async function Profile({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <ProfileScreen lang={lang} />;
}
