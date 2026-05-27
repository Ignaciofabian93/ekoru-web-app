import { hasLocale } from "@/constants/settings";
import { FavoritesScreen } from "@/features/profile/screens/Favorites";
import { notFound } from "next/navigation";

export default async function Favorites({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <FavoritesScreen lang={lang} />;
}
