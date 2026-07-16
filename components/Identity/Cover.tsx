import clsx from "clsx";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { Fragment, useRef } from "react";

interface CoverProps {
  // Profile only features
  isUploadingCover: boolean;
  uploadCover: (file: File) => void;
  changeCoverAriaLabel: string;
  // Shared features
  coverImage: string;
  coverAltText: string;
  defaultCoverImage: string;
  enableCoverUpload: boolean;
}

export function Cover({
  coverImage,
  coverAltText,
  isUploadingCover,
  uploadCover,
  changeCoverAriaLabel,
  defaultCoverImage,
  enableCoverUpload,
}: CoverProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_COVER = defaultCoverImage;

  return (
    <div className="relative  h-[40vh] min-h-60 w-full overflow-hidden sm:h-56">
      {coverImage ? (
        <>
          <Image
            src={coverImage}
            fill
            sizes="100vw"
            alt={coverAltText}
            aria-hidden
            className="scale-110 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-black/10" />
          {/* Foreground: the whole image, uncropped and undistorted. */}
          <Image
            src={coverImage}
            fill
            sizes="100vw"
            alt={coverAltText}
            className="object-contain"
            priority
          />
        </>
      ) : (
        <Image
          src={DEFAULT_COVER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* Bottom fade grounds the avatar and adds depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/25 to-transparent" />
      {enableCoverUpload && (
        <Fragment>
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            aria-label={changeCoverAriaLabel}
            className={clsx(
              "absolute top-3 right-3 flex h-9 w-9 items-center justify-center",
              "rounded-full bg-black/55 text-white transition-colors",
              "hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-70",
            )}
          >
            {isUploadingCover ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadCover(file);
              e.target.value = "";
            }}
          />
        </Fragment>
      )}
    </div>
  );
}
