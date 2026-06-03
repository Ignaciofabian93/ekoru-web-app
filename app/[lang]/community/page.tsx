import { hasLocale } from "@/constants/settings";
import { Community } from "@/features/community/screens/Community";
import { notFound } from "next/navigation";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Community lang={lang} />;
}
