"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
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
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck, Camera, Coins, Loader2, UserRoundPen } from "lucide-react";
import { useRef } from "react";
import { NAMESPACE } from "../i18n";
import { type SellerType } from "@/types/enums";
import { useProfileImageUpload } from "../hooks/useProfileImageUpload";
import { Badge } from "@/components/Badge/Badge";
import clsx from "clsx";

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
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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
      <div className="relative  h-[40vh] min-h-60 w-full overflow-hidden sm:h-56">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              fill
              sizes="100vw"
              alt=""
              aria-hidden
              className="scale-110 object-cover blur-2xl"
            />
            <div className="absolute inset-0 bg-black/10" />
            {/* Foreground: the whole image, uncropped and undistorted. */}
            <Image
              src={coverImage}
              fill
              sizes="100vw"
              alt=""
              className="object-contain"
              priority
            />
          </>
        ) : (
          <Image
            src={DEFAULT_COVER}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Bottom fade grounds the avatar and adds depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/25 to-transparent" />
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
      </div>

      {/* Identity — avatar overlaps the cover, details sit on the surface */}
      <div className="px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="-mt-14 flex flex-col items-center gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:gap-5">
          <div className="relative shrink-0">
            <Image
              src={userImage}
              alt=""
              width={200}
              height={200}
              className="size-28 rounded-full border-4 border-white bg-white object-cover shadow-md sm:size-36"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              aria-label={t("header.upload.changeAvatar")}
              className="absolute right-1 bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
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
              <Badge
                variant="primary"
                label={SELLER_TYPE_LABEL[sellerType as SellerType]}
                size="medium"
                icon={BadgeCheck}
              />
              <Badge
                variant="descriptive"
                label={t("header.points", { count: points.toLocaleString(lang) })}
                size="medium"
                icon={Coins}
              />
            </div>
          </div>

          <Link
            href={`/${lang}/profile/edit-profile`}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-md border border-border-light",
              "bg-primary/90 text-white px-3.5 py-2 text-sm font-semibold",
              "shadow-sm transition-all",
              "hover:brightness-110",
            )}
          >
            <UserRoundPen size={15} color="currentColor" strokeWidth={2} />
            {t("account.editProfile")}
          </Link>
        </div>
      </div>
    </section>
  );
}
