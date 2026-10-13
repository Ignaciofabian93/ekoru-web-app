import { hasLocale } from "@/constants/settings";
import { MessagesScreen } from "@/features/chat/screens/MessagesScreen";
import { notFound } from "next/navigation";

export default async function Messages({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <MessagesScreen lang={lang} />;
}
