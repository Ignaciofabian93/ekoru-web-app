import { BadgeCheck, Camera, Coins, Loader2 } from "lucide-react";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { Title } from "../Title/Title";
import { Text } from "../Text/Text";
import { Badge } from "../Badge/Badge";
import clsx from "clsx";

interface AvatarProps {
  // Profile only features
  isUploadingAvatar: boolean;
  uploadAvatar: (file: File) => void;
  changeAvatarAriaLabel: string;
  // Shared features
  userImage: string;
  enableAvatarUpload: boolean;
  sellerTypeLabel: string;
  pointsLabel: string;
  name: string;
  email: string;
  avatarAltText: string;
}

export function Avatar({
  userImage,
  isUploadingAvatar,
  changeAvatarAriaLabel,
  enableAvatarUpload,
  uploadAvatar,
  sellerTypeLabel,
  pointsLabel,
  name,
  email,
  avatarAltText,
}: AvatarProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="-mt-14 flex flex-col items-center gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:gap-5">
        <div className="relative shrink-0">
          <Image
            src={userImage}
            alt={avatarAltText}
            width={200}
            height={200}
            className="size-36 rounded-full border-4 border-white bg-white object-cover shadow-md"
          />
          {enableAvatarUpload && (
            <Fragment>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                aria-label={changeAvatarAriaLabel}
                className={clsx(
                  "absolute right-1 bottom-1 flex h-9 w-9 items-center justify-center",
                  "rounded-full border-2 border-white bg-primary text-white",
                  "shadow-md transition-all hover:brightness-110",
                  "disabled:cursor-not-allowed disabled:opacity-70",
                )}
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
            </Fragment>
          )}
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
              label={sellerTypeLabel}
              size="medium"
              icon={BadgeCheck}
            />
            <Badge variant="secondary" label={pointsLabel} size="medium" icon={Coins} />
          </div>
        </div>
      </div>
    </div>
  );
}
