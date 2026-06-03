import { hasLocale } from "@/constants/settings";
import { BlogCategory } from "@/features/blog/screens/BlogCategory";
import { notFound } from "next/navigation";

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;
  if (!hasLocale(lang)) notFound();

  return <BlogCategory lang={lang} slug={category} />;
}
