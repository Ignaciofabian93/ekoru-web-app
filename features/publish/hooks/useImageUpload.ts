"use client";
import { uploadProductImage } from "@/lib/api/products";
import { useCallback, useState } from "react";

/** Uploads listing images in parallel under the seller namespace and returns
 *  the R2 keys. The subgraphs persist keys verbatim; clients resolve them to
 *  CDN URLs at render time via resolveImageUrl. */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = useCallback(async (images: File[], ownerId: string) => {
    setUploading(true);
    try {
      const uploads = await Promise.all(
        images.map((file) => uploadProductImage(file, ownerId)),
      );
      return uploads.map((u) => u.key);
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, uploadImages };
}
