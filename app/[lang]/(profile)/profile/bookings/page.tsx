import { hasLocale } from "@/constants/settings";
import { BookingsScreen } from "@/features/profile/screens/Bookings";
import { notFound } from "next/navigation";

export default async function Bookings({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { lang } = await params;
  // The profile menu links each side straight to its tab (?tab=…).
  const { tab } = await searchParams;
  if (!hasLocale(lang)) notFound();

  return <BookingsScreen lang={lang} tab={tab} />;
}
