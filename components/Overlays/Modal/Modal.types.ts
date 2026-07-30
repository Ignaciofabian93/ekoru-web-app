import type React from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  /** Accessible name of the close button. Pass a translated string. */
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  size?: ModalSize;
  style?: React.CSSProperties;
}
