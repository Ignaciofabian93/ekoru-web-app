"use client";

import { MainButton } from "@/components/Button/MainButton";
import { Text } from "@/components/Text/Text";
import { colors } from "@/design/tokens";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface ErrorScreenProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionLabel?: string;
  showHomeLink?: boolean;
}

export default function ErrorScreen({
  title,
  message,
  onAction,
  actionLabel = "Try again",
  showHomeLink = true,
}: ErrorScreenProps) {
  const router = useRouter();

  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        backgroundColor: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingInline: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Image
          src="/assets/images/logo.png"
          alt="Ekoru"
          width={72}
          height={72}
          style={{ marginBottom: 16, opacity: 0.5, objectFit: "contain" }}
        />

        <Text size="xl" weight="bold" align="center">
          {title}
        </Text>

        <Text size="base" color="secondary" align="center">
          {message}
        </Text>

        {onAction && (
          <MainButton
            text={actionLabel}
            onPress={onAction}
            variant="primary"
            size="md"
            fullWidth
          />
        )}

        {showHomeLink && (
          <MainButton
            text="Go to home"
            onPress={() => router.replace("/")}
            variant="ghost"
            size="md"
            fullWidth
          />
        )}
      </div>
    </div>
  );
}
