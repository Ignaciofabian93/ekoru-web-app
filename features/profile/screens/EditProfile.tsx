import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { ProfileHero } from "../ui/ProfileHero";
import { EditProfileForm } from "../ui/EditProfileForm";

export async function EditProfileScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell
        nav={<Navigation lang={lang} />}
        hero={
          <ProfileHero
            icon="editProfile"
            titleKey="editProfile.screenTitle"
            subtitleKey="editProfile.screenSubtitle"
          />
        }
      >
        <EditProfileForm />
      </ScreenShell>
    </DictionaryProvider>
  );
}
