"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  // Leaf,
  // Package2,
  // Plus,
  // Star,
} from "lucide-react";

import type { BusinessProfile, Seller } from "@/types/user";
import {
  getBusinessProfile,
  getProfileImage,
  getSellerLocation,
} from "@/utils/sellerInformation";

// Placeholder metrics — no rating / product-count / CO₂ fields exist on the
// seller model yet. Shown until that data is wired into the GraphQL layer.
// const PLACEHOLDER_TAGS = ["Organic", "Zero Waste"];
// const PLACEHOLDER_METRICS = {
//   rating: "4.9",
//   reviews: "128",
//   products: "89",
//   co2: "1.2 t CO₂",
// };

function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function StoreCard(seller: Seller) {
  const profile: BusinessProfile | null = getBusinessProfile(seller);
  const location = getSellerLocation(seller);
  const profileImage = getProfileImage(seller);
  const isVerified = Boolean(seller.isVerified);

  const initials = getInitials(profile?.businessName);
  // const tags =
  //   profile?.certifications && profile.certifications.length > 0
  //     ? profile.certifications.slice(0, 3)
  //     : PLACEHOLDER_TAGS;

  return (
    <div className="w-80 shrink-0">
      <div className="flex w-full h-42 items-stretch rounded-2xl bg-white shadow-md overflow-hidden cursor-pointer">
        {/* Left panel — brand block, mirrors the home category cards */}
        <figure className="relative w-30 shrink-0 bg-linear-to-br from-secondary-dark to-secondary flex flex-col items-center justify-evenly overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute w-24 h-24 rounded-full bg-white/10 -top-6 -left-8" />
          <div className="absolute w-16 h-16 rounded-full bg-white/10 bottom-2 -right-6" />

          {/* Logo */}
          <div className="relative w-23 h-23 rounded-2xl overflow-hidden bg-linear-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg ring-1 ring-white/30">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={profile?.businessName ?? "logo"}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-white">{initials}</span>
            )}
          </div>

          {/* Verified pill */}
          {isVerified && (
            <div className="mx-auto w-fit flex items-center gap-1 bg-white text-secondary-dark text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <BadgeCheck size={13} className="text-secondary" />
              Verified
            </div>
          )}
        </figure>

        {/* Right panel — details */}
        <div className="flex flex-col flex-1 min-w-0 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-foreground truncate">{profile?.businessName}</p>
          </div>

          <div className="flex items-center gap-1 mt-0.5 text-xs text-foreground-secondary">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <p className="mt-1.5 text-sm text-foreground-secondary line-clamp-2">
            {profile?.description}
          </p>

          {/* <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div> */}

          <div className="flex items-center justify-end gap-2 mt-auto pt-3">
            {/* <div className="flex items-center gap-2.5 text-[11px] text-foreground-secondary">
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                {PLACEHOLDER_METRICS.rating} ({PLACEHOLDER_METRICS.reviews})
              </span>
              <span className="flex items-center gap-1">
                <Package2 size={13} />
                {PLACEHOLDER_METRICS.products}
              </span>
              <span className="flex items-center gap-1">
                <Leaf size={13} className="text-primary" />
                {PLACEHOLDER_METRICS.co2}
              </span>
            </div> */}

            <button className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:brightness-110 transition shrink-0">
              Visit store
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
