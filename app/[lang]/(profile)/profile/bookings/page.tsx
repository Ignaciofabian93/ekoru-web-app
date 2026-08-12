import { hasLocale } from "@/constants/settings";
import { BookingsScreen } from "@/features/profile/screens/Bookings";
import { notFound } from "next/navigation";

export default async function Bookings({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <BookingsScreen lang={lang} />;
}
