import clsx from "clsx";

export const cardScrollerStyles = {
  root: "flex items-center gap-2",
  rail: "scrollbar-none flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2",
  button: clsx(
    "hidden size-9 shrink-0 items-center justify-center rounded-full border border-border",
    "bg-surface text-foreground shadow-sm transition",
    "hover:border-primary hover:text-primary md:flex",
  ),
  buttonDisabled: "pointer-events-none opacity-40",
};
