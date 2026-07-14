import { hasLocale } from "@/constants/settings";
import { ProductCategory } from "@/features/marketplace/screens/ProductCategory";
import { notFound } from "next/navigation";

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{
    lang: string;
    department: string;
    category: string;
    productCategory: string;
  }>;
}) {
  const { lang, department, category, productCategory } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <ProductCategory
      lang={lang}
      departmentSlug={department}
      categorySlug={category}
      productCategorySlug={productCategory}
    />
  );
}
