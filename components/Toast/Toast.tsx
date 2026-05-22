import clsx from "clsx";
import { AlertCircle, CheckCircle, Info, type LucideIcon } from "lucide-react";
import React from "react";

export interface ToastProps {
  text1?: string;
  text2?: string;
  type?: "success" | "error" | "info";
  style?: React.CSSProperties;
}

const TOAST_CONFIG: Record<
  NonNullable<ToastProps["type"]>,
  { border: string; text: string; Icon: LucideIcon }
> = {
  success: { border: "border-l-success", text: "text-success", Icon: CheckCircle },
  error: { border: "border-l-danger", text: "text-danger", Icon: AlertCircle },
  info: { border: "border-l-primary", text: "text-primary", Icon: Info },
};

export function Toast({ text1, text2, type = "info", style }: ToastProps) {
  const { border, text, Icon } = TOAST_CONFIG[type];

  return (
    <div
      style={style}
      className={clsx(
        "box-border flex w-[90%] max-w-100 flex-row items-center gap-3 rounded-md border-l-4 bg-surface px-3.5 py-3 shadow-md",
        border,
      )}
    >
      <span className={clsx("shrink-0", text)}>
        <Icon size={20} color="currentColor" strokeWidth={2} />
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        {text1 && (
          <span className="font-sans text-sm font-semibold text-foreground">{text1}</span>
        )}
        {text2 && (
          <span className="font-sans text-sm font-normal text-foreground-secondary">
            {text2}
          </span>
        )}
      </div>
    </div>
  );
}

export default Toast;
