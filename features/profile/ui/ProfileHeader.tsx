"use client";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import {
  useCoverImage,
  useDisplayName,
  useProfileImage,
  useSellerEmail,
  useSellerPoints,
  useSellerType,
} from "@/store/useAuthStore";
import { useParams } from "next/navigation";
import { NAMESPACE } from "../i18n";
import { type SellerType } from "@/types/enums";
import { useProfileImageUpload } from "../hooks/useProfileImageUpload";
import { Avatar } from "@/components/Identity/Avatar";
import { Cover } from "@/components/Identity/Cover";

// Sellers without a custom cover get the profile wallpaper so the header
// still reads as a finished hero (never the brand logo stretched as cover).
const DEFAULT_COVER = "/wallpapers/wallpaper-2.jpg";

export function ProfileHeader() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const coverImage = useCoverImage();
  const profileImage = useProfileImage();
  const name = useDisplayName();
  const email = useSellerEmail();
  const sellerType = useSellerType();
  const points = useSellerPoints();

  const { uploadingKind, uploadAvatar, uploadCover } = useProfileImageUpload();

  const userImage = profileImage ?? "/brand/icon.webp";

  const SELLER_TYPE_LABEL: Record<string, string> = {
    PERSON: t("header.sellerType.person"),
    STARTUP: t("header.sellerType.startup"),
    COMPANY: t("header.sellerType.company"),
  };

  const isUploadingCover = uploadingKind === "cover";
  const isUploadingAvatar = uploadingKind === "avatar";

  return (
    <section className="mx-auto w-full">
      <Cover
        coverImage={coverImage ?? DEFAULT_COVER}
        isUploadingCover={isUploadingCover}
        uploadCover={uploadCover}
        coverAltText=""
        changeCoverAriaLabel={t("header.upload.changeCover")}
        defaultCoverImage={DEFAULT_COVER}
        enableCoverUpload={true}
      />

      {/* Identity — avatar overlaps the cover, details sit on the surface */}
      <Avatar
        name={name}
        email={email}
        sellerTypeLabel={SELLER_TYPE_LABEL[sellerType as SellerType]}
        userImage={userImage}
        isUploadingAvatar={isUploadingAvatar}
        enableAvatarUpload={true}
        uploadAvatar={uploadAvatar}
        changeAvatarAriaLabel={t("header.upload.changeAvatar")}
        pointsLabel={t("header.points", { count: points.toLocaleString(lang) })}
        avatarAltText=""
      />
    </section>
  );
}
