import { hasLocale } from "@/constants/settings";
import { EditProfileScreen } from "@/features/profile/screens/EditProfile";
import { notFound } from "next/navigation";

export default async function EditProfile({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <EditProfileScreen lang={lang} />;
}
