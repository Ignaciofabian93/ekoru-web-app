"use client";
import { BadgeCheck, Coins } from "lucide-react";
import { Badge } from "@/components/Primitives/Badge";
import { Avatar } from "@/components/Primitives/Avatar";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { Container } from "@/components/Layout";
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
    <Container as="section" width="default" gap={0} paddingY={2}>
      <Cover
        image={coverImage}
        altText=""
        uploading={uploadingKind === "cover"}
        onUpload={uploadCover}
        changeCoverAriaLabel={t("header.upload.changeCover")}
      />

      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left mt-3">
        <div className="relative z-10 -mt-11 shrink-0">
          <Avatar image={profileImage} alt="" size="xl" frame="raised" />
          <ImageUploadButton
            variant="badge"
            className="right-1 bottom-1"
            uploading={uploadingKind === "avatar"}
            onSelect={uploadAvatar}
            ariaLabel={t("header.upload.changeAvatar")}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 wrap-anywhere">
          <Title level="h1" size="h4" weight="semibold">
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
                size="small"
                icon={BadgeCheck}
              />
            )}
            <Badge
              variant="secondary"
              label={t("header.points", { count: String(points) })}
              size="small"
              icon={Coins}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
