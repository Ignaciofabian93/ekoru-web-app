import { hasLocale } from "@/constants/settings";
import { MainScreen } from "@/features/home/screens/MainScreen";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <MainScreen lang={lang} />;
}
