import api from "./client";

interface ProductImageUploadResponse {
  success: boolean;
  key: string;
  imageUrl: string;
}

/**
 * Uploads one product image through the same-origin `/api/products/images`
 * route (which forwards it to the gateway with the session cookie). Returns
 * the R2 object key, which is what the marketplace mutation persists on the
 * product so the value is stable across CDN domain changes.
 */
export async function uploadProductImage(
  file: File,
  entityId: string,
): Promise<{ key: string; imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("entityId", entityId);

  const { data } = await api.post<ProductImageUploadResponse>(
    "/products/images",
    formData,
  );

  return { key: data.key, imageUrl: data.imageUrl };
}
