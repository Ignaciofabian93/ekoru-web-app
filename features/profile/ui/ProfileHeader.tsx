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
import { NAMESPACE } from "../i18n";
import { type SellerType } from "@/types/enums";

export function ProfileHeader() {
  const { t } = useTranslation(NAMESPACE);
  const coverImage = useCoverImage();
  const profileImage = useProfileImage();
  const name = useDisplayName();
  const email = useSellerEmail();
  const sellerType = useSellerType();
  const points = useSellerPoints();

  const wallpaperImage = coverImage ?? "/brand/logo.webp";
  const userImage = profileImage ?? "/brand/icon.webp";

  const SELLER_TYPE_LABEL: Record<string, string> = {
    PERSON: t("header.sellerType.person"),
    STARTUP: t("header.sellerType.startup"),
    COMPANY: t("header.sellerType.company"),
  };

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="relative w-full">
        <Image
          src={wallpaperImage}
          alt=""
          width={1000}
          height={400}
          className="w-full min-h-50 h-auto object-cover"
        />
        <Image
          src={userImage}
          alt=""
          width={200}
          height={200}
          className="w-[40%] max-w-45 h-auto rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-white"
        />
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
