"use client";
import { MessageCircle } from "lucide-react";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/Primitives/Button";
import { useTranslation } from "@/i18n/context";
import {
  useStartConversation,
  type StartConversationArgs,
} from "../hooks/useStartConversation";

interface Props extends StartConversationArgs {
  /** Defaults to the root dictionary's "chatActions.contactSeller". */
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Opens the chat about an item (WEB-22). Chat is the way to reach a seller:
 * their email and phone stay private until there is a trade (USR-10, USR-14),
 * so talking happens where the deal can close.
 */
export function ContactSellerButton({
  itemType,
  itemId,
  counterpartId,
  label,
  variant = "outline",
  size = "md",
  fullWidth = true,
  className,
}: Props) {
  const { t } = useTranslation();
  const { start, loading } = useStartConversation();

  return (
    <Button
      text={label ?? t("chatActions.contactSeller")}
      loadingText={t("chatActions.opening")}
      loading={loading}
      leftIcon={MessageCircle}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      onPress={() => void start({ itemType, itemId, counterpartId })}
    />
  );
}
