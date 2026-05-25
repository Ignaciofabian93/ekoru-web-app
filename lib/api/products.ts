import api from "./client";

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
 * so the stored value stays stable across CDN domain changes.
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

  if (typeof data?.key !== "string" || data.key.length === 0) {
    console.error("[uploadProductImage] missing key in response:", data);
    throw new Error(
      `Image upload failed: no R2 key returned by the server (response: ${JSON.stringify(data)})`,
    );
  }

  return { key: data.key, imageUrl: data.imageUrl ?? "" };
}
