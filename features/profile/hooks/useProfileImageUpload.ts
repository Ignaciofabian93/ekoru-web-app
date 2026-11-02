"use client";
import { useCallback, useState } from "react";
import { uploadCoverImage, uploadProfileImage } from "@/lib/api/profile";
import { useToast } from "@/hooks/useToast";
import { useImageUploadMessage } from "@/hooks/useImageUploadMessage";
import { useTranslation } from "@/i18n/context";
import useAuthStore from "@/store/useAuthStore";
import { NAMESPACE } from "../i18n";

type ImageKind = "avatar" | "cover";

export function useProfileImageUpload() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const imageUploadMessage = useImageUploadMessage();
  const updateProfileImage = useAuthStore((s) => s.updateProfileImage);
  const updateCoverImage = useAuthStore((s) => s.updateCoverImage);

  const [uploadingKind, setUploadingKind] = useState<ImageKind | null>(null);

  const upload = useCallback(
    async (file: File, kind: ImageKind) => {
      setUploadingKind(kind);
      try {
        const { key } =
          kind === "avatar"
            ? await uploadProfileImage(file)
            : await uploadCoverImage(file);

        if (kind === "avatar") updateProfileImage(key);
        else updateCoverImage(key);

        toast.success(t("header.upload.success"));
      } catch (error) {
        toast.error(imageUploadMessage(error) ?? t("header.upload.error"));
      } finally {
        setUploadingKind(null);
      }
    },
    [imageUploadMessage, t, toast, updateCoverImage, updateProfileImage],
  );

  return {
    uploadingKind,
    uploadAvatar: (file: File) => upload(file, "avatar"),
    uploadCover: (file: File) => upload(file, "cover"),
  };
}
