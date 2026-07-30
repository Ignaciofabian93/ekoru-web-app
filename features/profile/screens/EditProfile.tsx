import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { EditProfileForm } from "../ui/EditProfileForm";
import { ProfileHeader } from "../ui/ProfileHeader";
import { PageLayout } from "@/components/Layout";

export async function EditProfileScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <EditProfileForm />
      </PageLayout>
    </DictionaryProvider>
  );
}
