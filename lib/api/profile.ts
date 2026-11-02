import api from "./client";
import { prepareImage, toImageUploadError } from "@/utils/imageUpload";

interface ProfileImageUploadResponse {
  message: string;
  key: string;
  imageUrl: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

/** Throws `ImageUploadError`, which says what was wrong with the image. */
async function uploadImage(
  route: "/profile/avatar" | "/profile/cover",
  file: File,
): Promise<{ key: string; imageUrl: string }> {
  const formData = new FormData();
  formData.append("file", await prepareImage(file));

  try {
    const { data } = await api.post<ProfileImageUploadResponse>(route, formData);
    return { key: data.key, imageUrl: data.imageUrl };
  } catch (error) {
    throw toImageUploadError(error);
  }
}

export function uploadProfileImage(file: File) {
  return uploadImage("/profile/avatar", file);
}

export function uploadCoverImage(file: File) {
  return uploadImage("/profile/cover", file);
}
