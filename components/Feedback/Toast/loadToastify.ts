"use client";

/**
 * react-toastify loads with the first toast instead of with every page. The
 * first call also tells `ToastProvider` to mount its container; toasts fired
 * before it mounts wait in react-toastify's own queue and show once it does.
 */
let requested = false;
const listeners = new Set<() => void>();

export function loadToastify() {
  if (!requested) {
    requested = true;
    listeners.forEach((listener) => listener());
  }
  return import("react-toastify");
}

export function subscribeToToastify(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const isToastifyRequested = () => requested;
