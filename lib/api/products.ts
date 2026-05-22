import api from "./client";

interface ProductImageUploadResponse {
  message: string;
  imagePath: string;
  imageUrl: string;
  fileName: string;
  originalSize: number;
  processedSize: number;
}

/**
 * Uploads one product image through the same-origin `/api/products/images`
 * route (which forwards it to the gateway with the session cookie). Returns the
 * absolute image URL to persist on the product — mirrors the mobile client so
 * products created on web and mobile store the same value.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  // The browser sets the multipart Content-Type (with boundary) for FormData.
  const { data } = await api.post<ProductImageUploadResponse>(
    "/products/images",
    formData,
  );

  return data.imageUrl;
}
