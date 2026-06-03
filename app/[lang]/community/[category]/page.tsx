import { hasLocale } from "@/constants/settings";
import { CommunityCategory } from "@/features/community/screens/CommunityCategory";
import { notFound } from "next/navigation";

export default async function CommunityCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;
  if (!hasLocale(lang)) notFound();

  return <CommunityCategory lang={lang} slug={category} />;
}
