import { hasLocale } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <main className="flex-1">
      <Navigation lang={lang} />
    </main>
  );
}
