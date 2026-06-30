import { hasLocale } from "@/constants/settings";
import { Search } from "@/features/search/screens/Search";
import { notFound } from "next/navigation";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { q } = await searchParams;

  return <Search lang={lang} query={q ?? ""} />;
}
