"use client";
import { useState } from "react";
import { prepareImage } from "@/utils/imageUpload";
import { useImageUploadMessage } from "./useImageUploadMessage";

/**
 * Prepares picked photos (see `prepareImage`) before they join a listing, and
 * keeps why the last one was refused, so the picker says it right away
 * instead of the upload failing when the form is sent.
 */
export function useImagePick(onAdd: (file: File) => void) {
  const imageUploadMessage = useImageUploadMessage();
  const [pickError, setPickError] = useState<string | null>(null);

  const addFiles = async (files: File[]) => {
    setPickError(null);
    for (const file of files) {
      try {
        onAdd(await prepareImage(file));
      } catch (error) {
        setPickError(imageUploadMessage(error));
      }
    }
  };

  return { pickError, addFiles };
}
