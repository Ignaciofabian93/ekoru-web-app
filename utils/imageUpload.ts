import { isAxiosError } from "axios";

/**
 * Why an image could not be uploaded, which is what the person is told
 * (`common.imageUpload.<problem>`):
 * - format: a format we can't read (HEIC on most browsers, PDF…);
 * - tooHeavy: over 10 MB even after shrinking;
 * - tooLarge: over 10,000 px per side;
 * - unreadable: a supported format, but damaged;
 * - session: signed out mid-upload;
 * - failed: our side or the network.
 */
export type ImageProblem =
  | "format"
  | "tooHeavy"
  | "tooLarge"
  | "unreadable"
  | "session"
  | "failed";

export class ImageUploadError extends Error {
  constructor(readonly problem: ImageProblem) {
    super(`Image upload failed: ${problem}`);
    this.name = "ImageUploadError";
  }
}

/** The gateway's and the image processor's byte limit. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** The image processor's pixel limit per side. */
const MAX_SOURCE_SIDE = 10_000;

/**
 * Longest side of an image we re-encode. Well above the largest size the
 * processor keeps (1920 px), so shrinking here costs no quality.
 */
const RESIZE_SIDE = 3000;

/** Formats sent as they are; the processor reads them and keeps transparency. */
const SENT_AS_IS = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Files `prepareImage` already returned, so the upload doesn't decode them again. */
const prepared = new WeakSet<File>();

/**
 * Makes a picked image one the server accepts, or says why it can't. A JPEG,
 * PNG or WebP within the limits goes as it is. Anything else the browser can
 * read (an oversized phone photo, HEIC on Safari, AVIF, GIF…) is redrawn as a
 * JPEG of at most 3000 px, so a camera photo just works. Throws
 * `ImageUploadError` when the browser can't read the file.
 */
export async function prepareImage(file: File): Promise<File> {
  if (prepared.has(file)) return file;
  if (file.type && !file.type.startsWith("image/")) {
    throw new ImageUploadError("format");
  }
  // Without createImageBitmap (very old browsers) the server decides.
  if (typeof createImageBitmap !== "function") return file;

  let bitmap: ImageBitmap;
  try {
    // No options: browsers apply the photo's EXIF rotation by default, and
    // older ones refuse `imageOrientation: "from-image"` outright.
    bitmap = await createImageBitmap(file);
  } catch {
    if (!SENT_AS_IS.has(file.type)) throw new ImageUploadError("format");
    if (file.size > MAX_IMAGE_BYTES) throw new ImageUploadError("tooHeavy");
    // A format the server reads, within its limit: whatever stopped this
    // browser (memory, a decoder quirk), the server has the last word.
    return file;
  }

  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    if (
      SENT_AS_IS.has(file.type) &&
      file.size <= MAX_IMAGE_BYTES &&
      longest <= MAX_SOURCE_SIDE
    ) {
      prepared.add(file);
      return file;
    }

    const scale = Math.min(1, RESIZE_SIDE / longest);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new ImageUploadError("unreadable");
    // JPEG has no transparency; white is what a transparent logo sits on.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (!blob) throw new ImageUploadError("unreadable");
    if (blob.size > MAX_IMAGE_BYTES) throw new ImageUploadError("tooHeavy");

    const name = `${file.name.replace(/\.[^.]*$/, "") || "image"}.jpg`;
    const result = new File([blob], name, { type: "image/jpeg" });
    prepared.add(result);
    return result;
  } finally {
    bitmap.close();
  }
}

const GATEWAY_CODES: Record<string, ImageProblem> = {
  IMAGE_FORMAT: "format",
  IMAGE_TOO_HEAVY: "tooHeavy",
  IMAGE_TOO_LARGE: "tooLarge",
  IMAGE_UNREADABLE: "unreadable",
};

/**
 * Turns a failed upload request into an `ImageUploadError`. The gateway names
 * the problem in `code`; before it did, only the status told them apart.
 */
export function toImageUploadError(error: unknown): ImageUploadError {
  if (error instanceof ImageUploadError) return error;
  if (!isAxiosError(error) || !error.response) return new ImageUploadError("failed");

  const { status, data } = error.response;
  const code = (data as { code?: unknown } | undefined)?.code;
  if (typeof code === "string" && code in GATEWAY_CODES) {
    return new ImageUploadError(GATEWAY_CODES[code]);
  }
  if (status === 401) return new ImageUploadError("session");
  if (status === 413) return new ImageUploadError("tooHeavy");
  if (status === 400 || status === 422) return new ImageUploadError("unreadable");
  return new ImageUploadError("failed");
}
