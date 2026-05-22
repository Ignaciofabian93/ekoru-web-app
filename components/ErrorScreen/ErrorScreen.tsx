"use client";

import { MainButton } from "@/components/Button/MainButton";
import { Text } from "@/components/Text/Text";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="flex w-full max-w-100 flex-col items-center gap-3">
        <Image
          src="/assets/images/logo.png"
          alt="Ekoru"
          width={72}
          height={72}
          className="mb-4 object-contain opacity-50"
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
