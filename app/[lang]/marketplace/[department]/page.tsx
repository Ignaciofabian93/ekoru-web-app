import { hasLocale } from "@/constants/settings";
import { Department } from "@/features/marketplace/screens/Department";
import { notFound } from "next/navigation";

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ lang: string; department: string }>;
}) {
  const { lang, department } = await params;
  if (!hasLocale(lang)) notFound();

  return <Department lang={lang} slug={department} />;
}
