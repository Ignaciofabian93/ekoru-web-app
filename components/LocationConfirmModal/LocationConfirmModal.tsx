"use client";

import MainButton from "@/components/Button/MainButton";
import Modal from "@/components/Modal/Modal";
import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import useLocationStore, {
  useDetectedLocation,
  useIsLocationConfirmed,
} from "@/store/useLocationStore";
import { MapPin, X } from "lucide-react";
import React from "react";

export default function LocationConfirmModal() {
  const detected = useDetectedLocation();
  const isConfirmed = useIsLocationConfirmed();
  const confirm = useLocationStore((s) => s.confirm);
  const dismissDetected = useLocationStore((s) => s.dismissDetected);

  const isVisible = !!detected && !isConfirmed;

  const handleConfirm = async () => {
    await confirm();
  };

  const handleDismiss = () => {
    dismissDetected();
  };

  if (!isVisible) return null;

  return (
    <Modal isOpen={isVisible} onClose={handleDismiss} title="">
      {/* Override default layout — render as bottom sheet */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          paddingTop: 8,
          position: "relative",
        }}
      >
        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            padding: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <X size={18} color={colors.foregroundTertiary} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: borderRadius.full,
            backgroundColor: `${colors.primary}18`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <MapPin size={28} color={colors.primary} />
        </div>

        {/* Title */}
        <span style={{ fontFamily: fontFamily.sans, fontWeight: 700, fontSize: fontSize.lg, color: colors.foreground, textAlign: "center" }}>
          We detected your location
        </span>

        {/* Location label */}
        <div
          style={{
            backgroundColor: colors.backgroundSecondary,
            paddingInline: 20,
            paddingBlock: 10,
            borderRadius: borderRadius.lg,
            marginBlock: 4,
          }}
        >
          <span style={{ fontFamily: fontFamily.sans, fontWeight: 600, fontSize: fontSize.base, color: colors.primary, textAlign: "center" }}>
            {detected!.city ? `${detected!.city}, ${detected!.country}` : detected!.country}
          </span>
        </div>

        {/* Subtitle */}
        <span style={{ fontFamily: fontFamily.sans, fontWeight: 400, fontSize: fontSize.sm, color: colors.foregroundSecondary, textAlign: "center", lineHeight: "20px" }}>
          Is this your location? We'll use it to show you relevant content.
        </span>

        {/* Actions */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          <MainButton text="Confirm Location" onPress={handleConfirm} style={{ width: "100%" }} />
          <button
            type="button"
            onClick={handleDismiss}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBlock: 10, background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontFamily: fontFamily.sans, fontWeight: 500, fontSize: fontSize.sm, color: colors.foregroundTertiary }}>
              Not my location
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
