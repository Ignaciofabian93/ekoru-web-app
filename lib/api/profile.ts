import api from "./client";

interface ProfileImageUploadResponse {
  message: string;
  key: string;
  imageUrl: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

export async function uploadProfileImage(file: File): Promise<{ key: string; imageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ProfileImageUploadResponse>("/profile/avatar", formData);

  return { key: data.key, imageUrl: data.imageUrl };
}

export async function uploadCoverImage(file: File): Promise<{ key: string; imageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ProfileImageUploadResponse>("/profile/cover", formData);

  return { key: data.key, imageUrl: data.imageUrl };
}
