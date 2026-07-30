"use client";
import { BadgeCheck, Coins } from "lucide-react";
import { Badge } from "@/components/Primitives/Badge";
import { Avatar } from "@/components/Primitives/Avatar";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import {
  useCoverImage,
  useDisplayName,
  useProfileImage,
  useSellerEmail,
  useSellerPoints,
  useSellerType,
} from "@/store/useAuthStore";
import type { SellerType } from "@/types/enums";
import { NAMESPACE } from "../i18n";
import { useProfileImageUpload } from "../hooks/useProfileImageUpload";
import { Cover } from "./Cover";
import { ImageUploadButton } from "./ImageUploadButton";

export function ProfileHeader() {
  const { t } = useTranslation(NAMESPACE);

  const coverImage = useCoverImage();
  const profileImage = useProfileImage();
  const name = useDisplayName();
  const email = useSellerEmail();
  const sellerType = useSellerType();
  const points = useSellerPoints();

  const { uploadingKind, uploadAvatar, uploadCover } = useProfileImageUpload();

  const SELLER_TYPE_LABEL: Record<SellerType, string> = {
    PERSON: t("header.sellerType.person"),
    STARTUP: t("header.sellerType.startup"),
    COMPANY: t("header.sellerType.company"),
  };

  return (
    <section className="mx-auto w-full">
      <Cover
        image={coverImage}
        altText=""
        uploading={uploadingKind === "cover"}
        onUpload={uploadCover}
        changeCoverAriaLabel={t("header.upload.changeCover")}
      />

      {/* Identity — avatar overlaps the cover, details sit on the surface */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-14 flex flex-col items-center gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:gap-5">
          <div className="relative shrink-0">
            <Avatar image={profileImage} alt="" size="xl" frame="raised" />
            <ImageUploadButton
              variant="badge"
              className="right-1 bottom-1"
              uploading={uploadingKind === "avatar"}
              onSelect={uploadAvatar}
              ariaLabel={t("header.upload.changeAvatar")}
            />
          </div>

          <div className="flex flex-1 flex-col items-center gap-1.5 text-center sm:items-start sm:pb-1 sm:text-left">
            <Title level="h1" size="h3" weight="semibold">
              {name}
            </Title>
            {email && (
              <Text variant="p" size="sm" color="secondary">
                {email}
              </Text>
            )}
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {sellerType && (
                <Badge
                  variant="primary"
                  label={SELLER_TYPE_LABEL[sellerType]}
                  size="medium"
                  icon={BadgeCheck}
                />
              )}
              <Badge
                variant="secondary"
                label={t("header.points", { count: String(points) })}
                size="medium"
                icon={Coins}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
