import { hasLocale } from "@/constants/settings";
import { ChangePasswordScreen } from "@/features/profile/screens/ChangePassword";
import { notFound } from "next/navigation";

export default async function ChangePassword({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <ChangePasswordScreen lang={lang} />;
}
