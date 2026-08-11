import { notFound } from "next/navigation";

import { hasLocale, type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";
import {
  getNotificationsDictionary,
  NAMESPACE,
} from "@/features/notifications/i18n";
import { NotificationsScreen } from "@/features/notifications/screens/NotificationsScreen";

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getNotificationsDictionary(lang as SupportedLanguage);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <NotificationsScreen />
      </PageLayout>
    </DictionaryProvider>
  );
}
