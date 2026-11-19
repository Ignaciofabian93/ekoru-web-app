"use client";

import { useMemo } from "react";
import type { Id, ToastOptions } from "react-toastify";
import {
  isToastifyRequested,
  loadToastify,
} from "@/components/Feedback/Toast/loadToastify";

type ToastKind = "success" | "error" | "info" | "warning";

let lastId = 0;

/** The id is set up front so it can be returned before react-toastify loads. */
function show(kind: ToastKind, message: React.ReactNode, options?: ToastOptions): Id {
  const toastId = options?.toastId ?? `toast-${++lastId}`;
  void loadToastify().then(({ toast }) => toast[kind](message, { ...options, toastId }));
  return toastId;
}

/**
 * App-wide notification helper backed by react-toastify. All toasts render
 * through the single `<ToastProvider />` mounted in the root layout, so this
 * hook can be called from any client component without extra setup.
 *
 * @example
 * const notify = useToast();
 * notify.success("Profile saved");
 * notify.error("Something went wrong");
 */
export function useToast() {
  return useMemo(
    () => ({
      success: (message: React.ReactNode, options?: ToastOptions) =>
        show("success", message, options),
      error: (message: React.ReactNode, options?: ToastOptions) =>
        show("error", message, options),
      info: (message: React.ReactNode, options?: ToastOptions) =>
        show("info", message, options),
      warning: (message: React.ReactNode, options?: ToastOptions) =>
        show("warning", message, options),
      /** Dismiss a specific toast by id, or all toasts when no id is passed. */
      dismiss: (id?: Id): void => {
        if (!isToastifyRequested()) return;
        void loadToastify().then(({ toast }) => toast.dismiss(id));
      },
    }),
    [],
  );
}
