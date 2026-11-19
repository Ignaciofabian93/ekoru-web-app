"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { isToastifyRequested, subscribeToToastify } from "./loadToastify";

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false },
);

/**
 * Single global mount point for react-toastify. Render this once near the root
 * of the app; every `useToast` call routes through this container, which only
 * mounts (and downloads) with the first toast.
 *
 * - `position="top-center"` keeps notifications pinned to the top center.
 * - `theme="colored"` fills each toast with its type color (success / error),
 *   which we remap to the brand palette via the `--toastify-color-*` overrides
 *   in `globals.css`.
 */
export function ToastProvider({ label = "Notifications" }: { label?: string }) {
  const requested = useSyncExternalStore(
    subscribeToToastify,
    isToastifyRequested,
    () => false,
  );
  if (!requested) return null;

  return (
    <ToastContainer
      position="top-center"
      theme="colored"
      autoClose={2600}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      aria-label={label}
    />
  );
}
