"use client";

import clsx from "clsx";
import { useState } from "react";

import {
  DEFAULT_COMMUNITY_LABELS,
  type CommunityCardData,
  type CommunityCardLabels,
} from "./types";
import FrontSide from "./FrontSide";
import BackSide from "./BackSide";

interface Props {
  post: CommunityCardData;
  href?: string;
  labels?: CommunityCardLabels;
  className?: string;
}

export default function CommunityCard({ post, href, labels, className }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);

  const merged: Required<CommunityCardLabels> = { ...DEFAULT_COMMUNITY_LABELS, ...labels };

  return (
    <div className={clsx("relative aspect-3/4 w-full min-w-0", className)}>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <FrontSide post={post} href={href} labels={merged} onFlip={flip} />
      </div>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <BackSide post={post} href={href} labels={merged} onFlip={flip} />
      </div>
    </div>
  );
}
