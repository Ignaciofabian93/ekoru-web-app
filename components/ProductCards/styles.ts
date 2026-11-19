import clsx from "clsx";

const cardShell = clsx(
  "flex flex-col overflow-hidden rounded-2xl border border-slate-400/40 bg-white",
  "shadow-md shadow-slate-900/20",
);

const roundButton = clsx(
  "relative z-10 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full shadow-sm",
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
);

export const cardStyles = {
  scene: "relative mx-auto size-full max-w-60 min-w-0",
  flipper: "relative size-full transform-3d transition-transform duration-500 ease-out",
  flipped: "rotate-y-180",
  shell: cardShell,
  face: clsx(
    "card-face group @container",
    cardShell,
    "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-focus",
  ),
  front: "relative size-full",
  back: "absolute inset-0 rotate-y-180",
  active: "visible",
  inactive: "invisible",
  actions: "pointer-events-none absolute inset-x-2 top-2 z-30 aspect-square transition-opacity",
  actionsHidden: "opacity-0 duration-150",
  actionsReturning: "opacity-100 delay-300 duration-200",
  actionsShown: "opacity-100 duration-100",
  actionsSlot: "pointer-events-auto absolute right-2 bottom-2",
};

export const buttonStyles = {
  flip: clsx(
    roundButton,
    "bg-linear-90 from-secondary-dark to-primary-light text-on-primary transition hover:brightness-110",
  ),
  like: clsx(roundButton, "bg-white shadow-slate-900/10 transition-transform hover:scale-105"),
  likeIconOn: "fill-red-500 text-red-500",
  likeIconOff: "text-foreground",
};

export const frontStyles = {
  mediaWrap: "shrink-0 px-2 pt-2",
  media: "relative aspect-square overflow-hidden rounded-xl bg-background-tertiary",
  image: "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
  imageSoldOut: "opacity-45 saturate-50",
  imageFallback: "flex size-full items-center justify-center text-foreground-tertiary",
  condition: "absolute bottom-2 left-2",
  badges: "absolute top-2 left-2 flex flex-col items-start gap-1",
  buttons: "absolute top-2 right-2 flex flex-col items-center gap-1.5",

  body: "flex flex-1 flex-col gap-1 px-3 pt-2.5 pb-1.5",
  priceRow: "flex min-h-7 items-center gap-2",
  price: "flex min-w-0 items-baseline gap-1.5",
  priceFrom: "text-xs font-bold text-foreground-tertiary",
  priceValue: "text-lg font-bold text-primary @min-[12rem]:text-xl",
  priceWas: "truncate text-xs text-foreground-tertiary line-through",
  rating: "ml-auto flex shrink-0 items-center gap-0.5",
  ratingValue: "flex items-center gap-0.5 text-xs font-bold text-foreground",
  ratingStar: "fill-amber-400 text-amber-400",
  reviews: "hidden text-xs text-foreground-tertiary @min-[12rem]:inline",
  name: clsx(
    "m-0 line-clamp-2 min-h-[2lh] text-sm leading-[1.3] font-semibold text-foreground",
    "@min-[12rem]:text-base",
  ),
  link: "outline-none after:absolute after:inset-0",
  location: "flex min-w-0 items-center gap-1 text-xs text-foreground-secondary",
  locationText: "truncate",
  labels: "mt-0.5 flex flex-wrap items-center gap-1",
  label: clsx(
    "inline-flex h-6 max-w-full min-w-0 items-center gap-1 rounded-md px-2",
    "text-xs leading-none font-semibold",
  ),
  labelText: "truncate",
  labelTone: {
    success: "bg-primary/15 text-primary-dark",
    warning: "bg-amber-50 text-amber-800",
    neutral: "bg-background-tertiary text-foreground-secondary",
  },

  footer: "mx-3 mt-auto flex min-h-10 items-center border-t border-slate-200/80 py-1",
  browse: "ml-auto inline-flex min-w-0 items-center gap-1 text-sm font-bold text-primary-active",
  browseText: "truncate",
};

export const backStyles = {
  flip: "absolute top-2 right-2",
  header: "shrink-0 px-2.5 pt-2.5 @min-[12rem]:px-3 @min-[12rem]:pt-3",
  title: "m-0 truncate border-b border-slate-200 pt-1 pr-10 pb-3.5 text-sm font-semibold text-foreground",

  section: "flex min-h-0 flex-1 flex-col overflow-hidden px-2.5 pt-3 @min-[12rem]:px-3",
  eyebrow: "block truncate text-xs font-bold tracking-[0.9px] text-foreground-secondary uppercase",
  savings: "flex shrink-0 flex-col pt-2",
  saving: "flex shrink-0 items-baseline justify-between gap-2",
  savingLabel: "flex min-w-0 items-center gap-1.5 text-xs text-foreground-secondary",
  savingShort: "truncate @min-[12rem]:hidden",
  savingFull: "hidden truncate @min-[12rem]:inline",
  savingValue: "flex shrink-0 items-baseline gap-0.5 font-bold",
  savingNumber: "text-base",
  savingUnit: "text-xs",

  materials: "min-h-0 overflow-hidden border-t border-slate-200 pt-3",
  materialList: "m-0 flex list-none flex-col gap-0.5 p-0 pt-2",
  material: "flex items-baseline text-xs leading-tight",
  materialNarrowHidden: "hidden @min-[12rem]:flex",
  materialLabel: "min-w-0 truncate text-foreground-secondary",
  materialLeader: "mx-1.5 min-w-2 flex-1 self-center border-b border-dotted border-border-strong",
  materialValue: "shrink-0 font-bold text-foreground",
  empty: "m-auto text-center text-xs text-foreground-secondary",
  impactLink: clsx(
    "mt-2 flex min-h-8 w-fit shrink-0 cursor-pointer items-center gap-1.5",
    "text-sm font-bold text-primary transition-colors hover:text-primary-active",
  ),

  description: "flex-1 overflow-y-auto px-3 py-2",
  descriptionText: "m-0 line-clamp-6 text-sm text-foreground-secondary",

  footer: "shrink-0 px-2.5 pb-2.5 @min-[12rem]:px-3 @min-[12rem]:pb-3",
  seller: "flex items-center gap-2 border-t border-slate-200 pt-2",
  avatar: clsx(
    "flex size-6.5 shrink-0 items-center justify-center overflow-hidden",
    "rounded-full bg-background-tertiary",
  ),
  avatarImage: "size-full object-cover",
  initials: "text-[10px] font-bold text-foreground-secondary",
  sellerText: "flex min-w-0 flex-col text-xs",
  sellerName: "truncate font-semibold text-foreground",
  sellerRegion: "flex min-w-0 items-center gap-1 text-foreground-secondary",
  sellerRegionIcon: "shrink-0 text-foreground-tertiary",
  sellerRegionText: "truncate",
};

export const scrollerStyles = {
  /** A product card's one width in a rail; `lg:w-56` stays under the card's `max-w-60`. */
  item: "w-46 shrink-0 snap-start md:w-50 lg:w-56",
};

export const skeletonStyles = {
  card: clsx(cardShell, "mx-auto size-full max-w-60 min-w-0"),
  media: "shrink-0 px-2 pt-2",
  mediaBlock: "aspect-square w-full",
  body: "flex flex-1 flex-col gap-2 px-3 pt-3 pb-2",
  price: "h-6 w-1/2",
  line: "h-4 w-full",
  shortLine: "h-4 w-2/3",
  footer: "mx-3 flex min-h-10 items-center border-t border-slate-200/80",
  browse: "ml-auto h-4 w-1/3",
  back: "flex size-full flex-col gap-2 p-3",
  backTitle: "mb-2 h-4 w-2/3",
  backLine: "h-3 w-full",
  backAvatar: "mt-auto size-6.5",
};
