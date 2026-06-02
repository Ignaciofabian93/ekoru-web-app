import { hasLocale } from "@/constants/settings";
import { Blog } from "@/features/blog/screens/Blog";
import { notFound } from "next/navigation";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Blog lang={lang} />;
}
