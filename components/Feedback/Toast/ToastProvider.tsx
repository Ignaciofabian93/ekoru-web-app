"use client";

import { ToastContainer } from "react-toastify";

/**
 * Single global mount point for react-toastify. Render this once near the root
 * of the app; every `useToast` call routes through this container.
 *
 * - `position="top-center"` keeps notifications pinned to the top center.
 * - `theme="colored"` fills each toast with its type color (success / error),
 *   which we remap to the brand palette via the `--toastify-color-*` overrides
 *   in `globals.css`.
 */
export function ToastProvider({ label = "Notifications" }: { label?: string }) {
  return (
    <ToastContainer
      position="top-center"
      theme="colored"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      aria-label={label}
    />
  );
}
