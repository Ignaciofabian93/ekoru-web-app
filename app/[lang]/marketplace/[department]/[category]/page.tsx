import { hasLocale } from "@/constants/settings";
import { DepartmentCategory } from "@/features/marketplace/screens/DepartmentCategory";
import { notFound } from "next/navigation";

export default async function DepartmentCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; department: string; category: string }>;
}) {
  const { lang, department, category } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <DepartmentCategory
      lang={lang}
      departmentSlug={department}
      categorySlug={category}
    />
  );
}
