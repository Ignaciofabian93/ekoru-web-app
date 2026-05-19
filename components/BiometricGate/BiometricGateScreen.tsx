"use client";

import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import useBiometricAuth from "@/hooks/useBiometricAuth";
import useAuthStore, { useSeller } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Fingerprint, ScanFace, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function BiometricGateScreen() {
  const router = useRouter();
  const seller = useSeller();
  const unlockWithBiometric = useAuthStore((s) => s.unlockWithBiometric);
  const logout = useAuthStore((s) => s.logout);
  const { isAvailable, supportedTypes, authenticate } = useBiometricAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName =
    seller?.profile?.__typename === "PersonProfile"
      ? seller.profile.firstName
      : seller?.profile?.__typename === "BusinessProfile"
        ? seller.profile.businessName
        : seller?.email ?? "";

  const isFace = supportedTypes.includes("face");
  const BiometricIcon = isFace ? ScanFace : Fingerprint;
  const biometricLabel = isFace ? "Face ID" : "Fingerprint";

  useEffect(() => {
    if (isAvailable) handleAuthenticate();
  }, [isAvailable]);

  const handleAuthenticate = async () => {
    setLoading(true);
    setError(null);
    const success = await authenticate(`Unlock as ${displayName}`);
    setLoading(false);
    if (success) {
      unlockWithBiometric();
    } else {
      setError("Authentication failed. Try again or use your password.");
    }
  };

  const handleUsePassword = async () => {
    await logout();
    router.replace("/auth");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: colors.backgroundTertiary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 24,
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius["2xl"],
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
          gap: 12,
          boxShadow: shadows.xl,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: borderRadius.full,
            backgroundColor: `${colors.primary}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <ShieldCheck size={40} color={colors.primary} strokeWidth={1.5} />
        </div>

        <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundSecondary }}>
          Welcome back
        </span>
        {displayName ? (
          <span style={{ fontSize: fontSize.xl, fontFamily: fontFamily.sans, fontWeight: 700, color: colors.foreground, marginTop: -4 }}>
            {displayName}
          </span>
        ) : null}
        <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.foregroundTertiary, textAlign: "center", marginBottom: 8 }}>
          Verify your identity to continue
        </span>

        <button
          type="button"
          onClick={handleAuthenticate}
          disabled={loading}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: colors.primary,
            paddingBlock: 14,
            paddingInline: 28,
            borderRadius: borderRadius.xl,
            width: "100%",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <span
              style={{
                width: 20,
                height: 20,
                border: `2px solid ${colors.onPrimary}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                display: "inline-block",
              }}
            />
          ) : (
            <>
              <BiometricIcon size={22} color={colors.onPrimary} strokeWidth={1.75} />
              <span style={{ fontSize: fontSize.base, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.onPrimary }}>
                Unlock with {biometricLabel}
              </span>
            </>
          )}
        </button>

        {error ? (
          <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 400, color: colors.danger, textAlign: "center" }}>
            {error}
          </span>
        ) : null}

        <button
          type="button"
          onClick={handleUsePassword}
          style={{ paddingBlock: 8, background: "none", border: "none", cursor: "pointer" }}
        >
          <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 500, color: colors.foregroundSecondary }}>
            Use password instead
          </span>
        </button>
      </div>
    </div>
  );
}
