import clsx from "clsx";

const cardShell = clsx(
  "relative flex h-full w-72 flex-col overflow-hidden rounded-2xl sm:w-70",
  "border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5",
);

export const cardStyles = {
  root: clsx(
    "group",
    cardShell,
    "transition duration-200",
    "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-focus",
  ),
};

export const frontStyles = {
  cover: "relative aspect-2/1 w-full shrink-0 overflow-hidden",
  coverImage: "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
  coverGlowTop: "absolute -top-8 -left-6 size-28 rounded-full bg-white/10",
  coverGlowBottom: "absolute -right-4 -bottom-10 size-24 rounded-full bg-white/10",
  coverFallback: {
    store: "bg-linear-to-br from-primary-dark to-primary",
    provider: "bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-800",
  },
  tag: clsx(
    "absolute top-3 right-3 max-w-[60%] truncate rounded-full bg-white/95",
    "px-3 py-1 text-xs font-medium text-foreground shadow-sm",
  ),

  logoWrap: "relative -mt-10 px-5",
  logo: clsx(
    "flex size-20 items-center justify-center overflow-hidden rounded-xl",
    "border-4 border-white bg-white shadow-md shadow-slate-900/10",
  ),
  logoImage: "size-full rounded-lg object-cover",
  logoFallback: "flex size-full items-center justify-center rounded-lg text-xl font-bold",
  logoFallbackTone: {
    store: "bg-primary-light-bg text-primary-dark",
    provider: "bg-zinc-100 text-zinc-800",
  },

  body: "flex flex-1 flex-col px-5 pt-3 pb-4",
  nameRow: "flex min-w-0 items-center gap-1.5",
  name: "m-0 truncate text-xl leading-snug font-bold text-foreground",
  link: "outline-none after:absolute after:inset-0",
  verified: "shrink-0 text-secondary-dark",
  description: "m-0 mt-1.5 line-clamp-2 min-h-[2lh] text-sm text-foreground-secondary",
  location: "mt-4 flex min-w-0 items-center gap-1.5 text-sm text-foreground-secondary",
  locationText: "truncate",
  footerWrap: "mt-auto pt-4",
  footer: "flex items-center justify-between gap-3 border-t border-slate-200/80 pt-3",
  count: "truncate text-xs text-foreground-secondary",
  cta: "inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary-active",
};

export const skeletonStyles = {
  card: cardShell,
  cover: "aspect-2/1 w-full shrink-0",
  logoWrap: "relative -mt-10 px-5",
  logo: "size-20 border-4 border-white",
  body: "flex flex-1 flex-col gap-2 px-5 pt-3 pb-4",
  name: "h-6 w-2/3",
  line: "h-4 w-full",
  shortLine: "h-4 w-1/2",
  footer: "mt-auto h-4 w-full",
};
