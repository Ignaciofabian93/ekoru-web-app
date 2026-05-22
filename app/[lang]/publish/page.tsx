import { hasLocale } from "@/constants/settings";
import { Publish } from "@/features/publish/screens/Publish";
import { notFound } from "next/navigation";

export default async function PublishPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Publish lang={lang} />;
}
