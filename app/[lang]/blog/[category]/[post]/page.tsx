import { hasLocale } from "@/constants/settings";
import { BlogPost } from "@/features/blog/screens/BlogPost";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; category: string; post: string }>;
}) {
  const { lang, category, post } = await params;
  if (!hasLocale(lang)) notFound();

  return <BlogPost lang={lang} categorySlug={category} slug={post} />;
}
