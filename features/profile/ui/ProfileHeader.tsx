"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import {
  useCoverImage,
  useDisplayName,
  useProfileImage,
  useSellerEmail,
  useSellerPoints,
  useSellerType,
} from "@/store/useAuthStore";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";
import { NAMESPACE } from "../i18n";
import { type SellerType } from "@/types/enums";
import { useProfileImageUpload } from "../hooks/useProfileImageUpload";

export function ProfileHeader() {
  const { t } = useTranslation(NAMESPACE);
  const coverImage = useCoverImage();
  const profileImage = useProfileImage();
  const name = useDisplayName();
  const email = useSellerEmail();
  const sellerType = useSellerType();
  const points = useSellerPoints();

  const { uploadingKind, uploadAvatar, uploadCover } = useProfileImageUpload();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const wallpaperImage = coverImage ?? "/brand/logo.webp";
  const userImage = profileImage ?? "/brand/icon.webp";

  const SELLER_TYPE_LABEL: Record<string, string> = {
    PERSON: t("header.sellerType.person"),
    STARTUP: t("header.sellerType.startup"),
    COMPANY: t("header.sellerType.company"),
  };

  const isUploadingCover = uploadingKind === "cover";
  const isUploadingAvatar = uploadingKind === "avatar";

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="relative w-full">
        <Image
          src={wallpaperImage}
          alt=""
          width={1000}
          height={400}
          className="w-full min-h-50 h-auto max-h-60 object-cover"
        />
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          disabled={isUploadingCover}
          aria-label={t("header.upload.changeCover")}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploadingCover ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Camera size={16} />
          )}
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadCover(file);
            e.target.value = "";
          }}
        />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[40%] max-w-45">
          <div className="relative">
            <Image
              src={userImage}
              alt=""
              width={200}
              height={200}
              className="w-full h-auto rounded-full border-4 border-white"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              aria-label={t("header.upload.changeAvatar")}
              className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white border-2 border-white shadow-md transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUploadingAvatar ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-24 text-center flex flex-col gap-2">
        <Title level="h3" size="h3" align="center" weight="medium">
          {name}
        </Title>
        <Text variant="p" align="center">
          {email}
        </Text>
        <div className="w-fit mx-auto rounded-lg bg-primary-light/20 px-4">
          <Text variant="span" size="sm" weight="semibold">
            {SELLER_TYPE_LABEL[sellerType as SellerType]}
          </Text>
        </div>
        <Text variant="p" align="center" size="sm">
          {points} Pts
        </Text>
      </div>
    </section>
  );
}
