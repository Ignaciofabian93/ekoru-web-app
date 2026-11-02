import api from "./client";
import { ImageUploadError, prepareImage, toImageUploadError } from "@/utils/imageUpload";

interface ProductImageUploadResponse {
  success?: boolean;
  key?: string | null;
  imageUrl?: string | null;
}

/**
 * Uploads one product image through the same-origin `/api/products/images`
 * route, which forwards it to the gateway. The gateway resizes the file via
 * ekoru-image-processor and stores the WebP in Cloudflare R2. Returns the R2
 * object key — that's what the marketplace mutation persists on the product,
 * so the stored value stays stable across CDN domain changes. Throws
 * `ImageUploadError`, which says what was wrong with the image.
 */
export async function uploadProductImage(
  file: File,
  entityId: string,
): Promise<{ key: string; imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", await prepareImage(file));
  formData.append("entityId", entityId);

  let data: ProductImageUploadResponse;
  try {
    ({ data } = await api.post<ProductImageUploadResponse>("/products/images", formData));
  } catch (error) {
    throw toImageUploadError(error);
  }

  if (typeof data?.key !== "string" || data.key.length === 0) {
    console.error("[uploadProductImage] missing key in response:", data);
    throw new ImageUploadError("failed");
  }

  return { key: data.key, imageUrl: data.imageUrl ?? "" };
}
