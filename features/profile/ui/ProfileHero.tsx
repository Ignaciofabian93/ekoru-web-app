"use client";
import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";
import { useTranslation } from "@/i18n/context";
import {
  Gem,
  Heart,
  KeyRound,
  Leaf,
  PackagePlus,
  Settings as SettingsIcon,
  UserRoundPen,
  type LucideIcon,
} from "lucide-react";
import { NAMESPACE } from "../i18n";

export type ProfileHeroIcon =
  | "editProfile"
  | "changePassword"
  | "orders"
  | "favorites"
  | "environmentalImpact"
  | "subscription"
  | "settings";

const ICONS: Record<ProfileHeroIcon, LucideIcon> = {
  editProfile: UserRoundPen,
  changePassword: KeyRound,
  orders: PackagePlus,
  favorites: Heart,
  environmentalImpact: Leaf,
  subscription: Gem,
  settings: SettingsIcon,
};

interface ProfileHeroProps {
  icon: ProfileHeroIcon;
  titleKey: string;
  subtitleKey: string;
}

export function ProfileHero({ icon, titleKey, subtitleKey }: ProfileHeroProps) {
  const { t } = useTranslation(NAMESPACE);
  return <ScreenHeader icon={ICONS[icon]} title={t(titleKey)} subtitle={t(subtitleKey)} />;
}
