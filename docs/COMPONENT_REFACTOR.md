# Component Refactor — Migration Checklist

Reorganizes `components/` into PascalCase group folders so every component has one
obvious home, one set of spacing tokens, its own tests, and its own translations.

Complements [ARCHITECTURE.md](./ARCHITECTURE.md) — the feature-first rules there are
unchanged. `app/` stays routing-only, `features/` still owns everything feature-specific.
This document only moves the **shared** layer.

## Target structure

```
components/
  Primitives/     atoms — no data, no business logic, no feature i18n
  Layout/         the spacing & distribution system
  Patterns/       composed, still feature-agnostic
  Cards/          entity cards used by 2+ features
  Overlays/       anything that portals or traps focus
  Feedback/       empty / error / loading / toast
```

### Placement rule

| Used by     | Has domain logic | Goes to                                |
| ----------- | ---------------- | -------------------------------------- |
| 1 feature   | either           | `features/<name>/ui/`                  |
| 2+ features | no               | `components/<Group>/`                  |
| 2+ features | yes              | shared feature module consumed by both |

### Per-component folder contract

```
components/Primitives/Button/
  Button.tsx
  Button.types.ts        # only when props are non-trivial
  Button.test.tsx        # behavior
  Button.a11y.test.tsx   # axe, looped over en/es/fr
  index.ts               # the single public export
```

### i18n rule for shared components

A shared component **never** calls `useTranslation(FEATURE_NAMESPACE)`. It either takes
text through a `labels` prop, or owns its own namespace with
`i18n/index.ts` + `i18n/locales/{en,es,fr}.json` (the pattern `components/Drawer` already
uses).

This is what currently breaks `MarketplaceCard`: it reads the `marketplace` namespace, so
any screen embedding it must also load that dictionary or the card renders raw keys.

---

## Phase 0 — Foundation

- [ ] Add the test runner — there is none today. `vitest`, `@testing-library/react`,
      `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest-axe`, `jsdom`.
- [ ] Add `vitest.config.ts` with the `@/*` path alias mirrored from `tsconfig.json`.
- [ ] Add `"test"` and `"test:watch"` scripts to `package.json`.
- [ ] Write `test/renderWithDict.tsx` — a helper that wraps a component in
      `DictionaryProvider` for a given locale, so a11y tests can loop `["en","es","fr"]`.
- [ ] Delete the two empty placeholder dirs: `components/Drawer/test/`,
      `components/Identity/tests/`. (`Identity/` is now deleted outright.)

## Phase 1 — Delete dead code

All verified to have zero importers. Removing them first shrinks the surface to migrate.

- [ ] `components/Actions/FavoriteButton.tsx` — concept returns as `Primitives/IconButton`
- [ ] `components/Actions/ShareButton.tsx` — same
- [ ] `components/Banner/`
- [ ] `components/Card/BlogCard/` — blog feature has its own `BlogPostCard`
- [ ] `components/Card/CommunityCard/`
- [ ] `components/DatePicker/`
- [ ] `components/ErrorScreen/` — rebuilt as `Feedback/ErrorState`
- [ ] `components/Hero/ScreenHero.tsx` — superseded by `Patterns/PageHero`
- [ ] `components/Hero/InnerHero.tsx` — superseded by `Patterns/BreadcrumbHero`
- [x] `components/Identity/NavAvatar.tsx`
- [ ] `components/Links/ExternalLink.tsx`
- [ ] `components/PaymentCard/`
- [ ] `components/SearchFilters/` — marketplace has `MarketplaceFilters`
- [ ] `components/TabBar/CustomTabBar.tsx`
- [ ] `components/UploadImageCard/` — publish has `ImagePicker`
- [ ] `components/ProductGallery/ProductGallery.tsx` — duplicate; the feature copy wins
      (see Phase 4)

## Phase 2 — Layout system

Build this before anything else; the visual consistency you're after lands here.
Seven competing shells exist today with container widths of `3xl`, `4xl`, `5xl`, `6xl`
and `7xl`.

- [ ] **Decide the width scale.** Proposed three:
      `narrow` = `max-w-4xl` (forms, auth, profile) ·
      `default` = `max-w-6xl` (catalogs, listings) ·
      `wide` = `max-w-7xl` (seller storefront). Every screen re-pins to one.
- [ ] **Decide whether `Page` owns Navigation + Footer.** Recommended yes, with opt-out —
      it deletes the manual `<Footer lang={lang} />` from ~15 screens and removes the
      cross-feature `→ footer` and `→ navigation` imports.

| New                 | Source                                 | Replaces                                                                                                                                                                                                                                                                                                 |
| ------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Layout/Page/`      | new                                    | `Layout/ScreenShell.tsx`, `Layout.Screen`, `features/marketplace/ui/MarketplaceShell.tsx`, `features/product/ui/ProductShell.tsx`, `features/seller/ui/SellerShell.tsx`, `features/search/ui/SearchShell.tsx`, `features/store-product/ui/StoreProductShell.tsx`, `features/publish/ui/PublishShell.tsx` |
| `Layout/Container/` | `Layout/Layout.tsx` (`Container`)      | `Layout/ContentLayout.tsx` (`ContentLayout` + `InnerContentLayout`)                                                                                                                                                                                                                                      |
| `Layout/Section/`   | `Layout/Layout.tsx` (`Section`)        | ad-hoc `<section>` wrappers                                                                                                                                                                                                                                                                              |
| `Layout/Stack/`     | `Layout/Layout.tsx` (`Row` + `Column`) | —                                                                                                                                                                                                                                                                                                        |
| `Layout/Grid/`      | `Layout/ProductListGrid.tsx`           | 4 hand-rolled grids (gaps `2`, `2.5`, `4`)                                                                                                                                                                                                                                                               |
| `Layout/Divider/`   | new                                    | inline `<hr>` in `AuthShell` and others                                                                                                                                                                                                                                                                  |

- [ ] Create the six folders above with the full file contract.
- [ ] Migrate all 7 shells onto `Page`.
- [ ] `features/auth/ui/AuthShell.tsx` — keep as a feature shell (genuinely bespoke
      two-column layout), but compose it from `Page` + `Container`.
- [ ] Delete `Layout/Layout.tsx`, `Layout/ContentLayout.tsx`, `Layout/ScreenShell.tsx`,
      `Layout/ProductListGrid.tsx` once all consumers move.

## Phase 3 — Primitives ✅ done

| From                               | To                                                              |
| ---------------------------------- | --------------------------------------------------------------- |
| `components/Button/MainButton.tsx` | `Primitives/Button/` — API kept (`text`, `onPress`, 9 variants) |
| `components/Text/Text.tsx`         | `Primitives/Text/`                                              |
| `components/Title/Title.tsx`       | `Primitives/Title/`                                             |
| `components/Input/Input.tsx`       | `Primitives/Inputs/Input.tsx`                                   |
| `components/Input/Search.tsx`      | `Primitives/Inputs/Search.tsx` as `SearchInput` (form field)    |
| `components/TextArea/TextArea.tsx` | `Primitives/TextArea/` (now a named export)                     |
| `components/Select/Select.tsx`     | `Primitives/Select/` (15 consumers — highest churn)             |
| `components/Checkbox/Checkbox.tsx` | `Primitives/Checkbox/`                                          |
| `components/Badge/Badge.tsx`       | `Primitives/Badge/`                                             |
| `components/Links/LinkButton.tsx`  | `Primitives/LinkButton/`                                        |
| `components/EkoruLogo/`            | `Primitives/EkoruLogo/`                                         |

New primitives:

- [x] `Primitives/Toggle/` — promoted from `features/profile/ui/Toggle.tsx`
- [x] `Primitives/Skeleton/` — `className` + `radius` + `count`
- [x] `Primitives/IconButton/` — icon-only button, required `ariaLabel`

Notes:

- All primitives are React 19 style: `forwardRef` dropped, `ref` is a plain prop.
- The nav search bar was **not** a primitive. `Primitives/Inputs/Search.tsx` now
  holds the reusable form field; the `<form role="search">` markup was folded
  into `components/Navigation/SearchBar.tsx`, which already owned the query logic.
- `components/Identity/Avatar.tsx` was a profile header block (avatar upload,
  seller badges), not a primitive. `Primitives/Avatar/` is the real primitive and
  already existed; the block moved into `features/profile/` — see Phase 7.
- The `IconButton` call sites the plan named have drifted: `ProductActions` and
  `StoreProductActions` now render full-width _labelled_ action buttons, not
  circular icon buttons. Left alone for the Phase 8 `product-detail` merge.
- [ ] Backfill `*.test.tsx` + `*.a11y.test.tsx` for each (deferred until the
      migration lands, per the agreed order).

## Phase 4 — Patterns ✅ done

| New / moved                | Replaces                                                                                                                                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Patterns/PageHero/`       | 5 byte-identical clones: `features/blog/ui/BlogHero.tsx`, `features/community/ui/CommunityHero.tsx`, `features/services/ui/ServicesHero.tsx`, `features/stores/ui/StoreHero.tsx`, `features/marketplace/ui/Hero.tsx` |
| `Patterns/BreadcrumbHero/` | 5 byte-identical clones: `BlogInnerHero`, `CommunityInnerHero`, `ServiceInnerHero`, `StoreInnerHero`, `marketplace/ui/InnerHero`                                                                                     |
| `Patterns/GradientHeader/` | `components/ScreenHeader/ScreenHeader.tsx` (rename)                                                                                                                                                                  |
| `Patterns/SectionHeader/`  | `features/home/ui/Wrapper.tsx` + inline `h2`/`p` blocks in `SellerCatalog`, `ListingsPanel`, `SectionCard`                                                                                                           |
| `Patterns/ResultsGrid/`    | `features/marketplace/ui/ProductGrid.tsx`, `features/stores/ui/StoreProductGrid.tsx`, `features/search/ui/SearchResultsGrid.tsx` — one component taking `items` / `loading` / `renderItem` / `emptyIcon`             |
| `Patterns/Breadcrumb/`     | `components/BreadCrumbs/Breadcrumb.tsx` (fixes the `BreadCrumbs` folder casing)                                                                                                                                      |
| `Patterns/Pagination/`     | `components/Pagination/` (9 consumers)                                                                                                                                                                               |
| `Patterns/Tabs/`           | `components/UnderlineTabs/` (9 consumers) + the pill tabs re-implemented inside `features/profile/ui/FavoritesGrid.tsx`                                                                                              |
| `Patterns/CardScroller/`   | `components/Card/CardScroller/` (6 consumers)                                                                                                                                                                        |
| `Patterns/ProductGallery/` | `features/product/ui/ProductGallery.tsx` — promote; `store-product` currently imports the `components/` duplicate                                                                                                    |
| `Patterns/StatTile/`       | the impact/stat tiles in `StatsSection`, `ImpactSnapshot`, `SellerStats`, `ActivitySnapshot`                                                                                                                         |

Corrections to the table above, as built:

- `Patterns/SectionHeader` was promoted from `features/home/ui/SectionHeader.tsx`
  (7 consumers), not from `Wrapper.tsx` — that rewrite had already happened, and
  the promoted version is free of the interpolated-class bug.
- `CardScroller` went to **`Cards/CardScroller/`**, not `Patterns/`. It is
  card-only, so it belongs with the other card components.
- `Patterns/Banner/` was given its missing `index.ts`.

Resolved decisions:

- `PageHero` takes `title` / `subtitle` as **strings**. The five screens are async
  server components that already `await` their dictionary, so they pass
  `dict.page.title` directly — `PageHero` needs no `"use client"` and no namespace.
- `PageHero` max width reconciled to `max-w-5xl` (4 of 5 clones used it; `StoreHero`
  was the `max-w-4xl` outlier).
- `ProductGallery`: both copies reconciled into one that obeys the shared-component
  i18n rule. Index-dependent labels (`imageAlt`, `thumbnailAlt`, `goToImage`) are
  **functions** on a `labels` prop, because the indices only exist inside the
  component. The feature copy that read the `product` namespace is gone.
- `Tabs`: `UnderlineTabs` → `Tabs`, `UnderlineTab` → `Tab`.

Deliberately **not** folded into `StatTile`:

- `features/home/ui/StatsSection.tsx` — its tile is an inline pill inside a
  scrolling marquee band, a different component.
- `features/seller/ui/SellerStats.tsx` — renders label _before_ value in a
  responsive col→row box. Converting it would be a visual change, not a move.

Fixed in passing:

- **`CardScroller`'s arrows were dead.** All 6 consumers own a `scrollRef` used for
  `scrollBy` and for the `canScrollLeft` / `canScrollRight` state, but
  `CardScroller` kept a private ref and never accepted theirs — so
  `scrollRef.current` was always `null`, the arrows did nothing and stayed
  permanently disabled. `CardScroller` now takes `scrollRef` and attaches it to the
  rail; all 6 call sites pass it.
- `CardScroller`'s inner `ScrollButton` hard-coded `handleScroll(-SCROLL_STEP)`, so
  the right arrow only worked because the parent's closure ignored the argument. It
  now takes a plain `onPress`.
- `Pagination`'s chevron `aria-label`s and `Select`'s `ariaLabel` were hardcoded
  English; they are now props with English defaults.

## Phase 5 — Cards

| From                                           | To                           |
| ---------------------------------------------- | ---------------------------- |
| `components/Card/MarketplaceCard/`             | `Cards/MarketplaceCard/`     |
| `components/Card/StoreProductCard/`            | `Cards/StoreProductCard/`    |
| `components/Card/ServiceCard/`                 | `Cards/ServiceCard/`         |
| `components/Card/SellerCard/`                  | `Cards/SellerCard/`          |
| `components/Card/StoreCard/`                   | `Cards/StoreCard/`           |
| `components/Card/ServiceProviderCard/`         | `Cards/ServiceProviderCard/` |
| `components/Card/shared/ProductImpactBack.tsx` | `Cards/ProductImpactBack/`   |

- [ ] **Reconcile the two `StoreProductCard`s.** `components/Card/StoreProductCard/` is 87
      lines; `features/stores/ui/StoreProductCard.tsx` is 256 lines and is what
      `features/profile/ui/FavoritesGrid.tsx` imports — a cross-feature import that
      should not exist. One survivor, in `Cards/`.
- [ ] Extract `Cards/CardFace/` — the front/back flip wrapper duplicated across every
      `*Card/FrontSide.tsx` + `BackSide.tsx` pair.
- [ ] Give each card its own i18n namespace so it stops depending on the host screen's
      dictionary. Start with `MarketplaceCard`.
- [ ] Fold `features/search/ui/SearchResultCard.tsx` and
      `features/seller/ui/SellerProductCard.tsx` into the shared cards.

## Phase 6 — Overlays & Feedback ✅ done

| From                                               | To                                                     |
| -------------------------------------------------- | ------------------------------------------------------ |
| `components/Modal/Modal.tsx`                       | `Overlays/Modal/` (7 consumers)                        |
| `components/Toast/Toast.tsx` + `ToastProvider.tsx` | `Feedback/Toast/` (mounted in `app/[lang]/layout.tsx`) |
| `components/EnvironmentalImpactModal/`             | `Cards/ImpactModal.tsx` — see the placement note below |

New:

- [x] `Overlays/Dropdown/` — `useDropdown` (outside-click / Escape+refocus / focus-out),
      `useRovingFocus` (arrow / Home / End / Tab), `DropdownPanel`, `DropdownItem`.
      Adopted by `components/Navigation/ProfileDropdown.tsx` (−86 lines) and
      `features/profile/ui/ProductActionsMenu.tsx`.
- [x] `Overlays/ConfirmDialog/` — `DeleteProductDialog` is now a 38-line wrapper that
      only supplies the profile namespace's strings.
- [x] `Feedback/EmptyState/` — `compact` / `default` / `prominent`, replacing all four:
      `community/ui/DetailEmptyState`, `services/ui/DetailEmptyState`,
      `profile/ui/EmptyState` (deleted) and `cart/ui/EmptyCart` (now a wrapper).
- [x] `Feedback/ErrorState/` — adopted by `ProductStatus` and `StoreProductStatus`.
- [x] `Feedback/SkeletonGrid/` — for grids that aren't result lists;
      `Patterns/ResultsGrid` already renders this shape internally.

### Where the impact modal belongs: `Cards/`, not `Overlays/` or `features/profile/`

The Phase 7 line sending `components/EnvironmentalImpactModal/` to
`features/profile/ui/` was wrong — nothing in `features/profile` imports it. Every
consumer is a card opening it from the back-side "view full impact" control, so it
lives with the cards. `Cards/ImpactModal.tsx` (already present) is the survivor; the
duplicate `components/EnvironmentalImpactModal/` is deleted and its three remaining
consumers — `features/stores/ui/StoreProductCard`,
`components/Card/MarketplaceCard`, `components/Card/StoreProductCard` — now point at
it. `Overlays/` is for the generic mechanism (`Modal`); a domain modal built on top
of it is not an overlay primitive.

### `Overlays/Modal` was the _older_ of the two copies

`components/Overlays/Modal/Modal.tsx` already existed but had been forked earlier: it
hardcoded `aria-label="Close"` where `components/Modal/Modal.tsx` had a translatable
`closeLabel` prop. The two were merged rather than one being picked — the survivor
keeps `closeLabel` **and** the `set-state-in-effect` eslint-disable that only the
Overlays copy carried, which clears the last standing lint error in the repo.
`aria-labelledby` now wires the dialog to its own title.

Deliberately **not** converted:

- `features/recycle/ui/RecycleStatus.tsx` — a full-height centered overlay inside the
  map container, not a page-level block. `ErrorState`'s `max-w-md py-16` treatment
  would change the layout.

`EmptyState` takes both `actionLabel` + `onAction` (the common primary-button case,
which all four profile call sites use) and an `action` ReactNode for arbitrary CTAs
like the cart's `Link`. `action` wins when both are given.

## Phase 7 — Move feature-only components out of `components/`

These have exactly one consuming feature, so by the placement rule they belong to it.

Already handled elsewhere: `components/Input/Search.tsx` became the shared
`Primitives/Inputs` field in Phase 3 (the nav search bar owns its own markup), and
`components/EnvironmentalImpactModal/` went to `Cards/ImpactModal.tsx` in Phase 6.

**`components/Identity/` is gone.** ✅

- `Identity/Cover.tsx` → `features/profile/ui/Cover.tsx`.
- `Identity/Avatar.tsx` was never a primitive — it was the profile header's
  identity block (avatar upload, name, email, seller badges). Its markup now lives
  inline in `features/profile/ui/ProfileHeader.tsx`, and the avatar itself is the
  real `Primitives/Avatar`.
- `Identity/NavAvatar.tsx` and the empty `Identity/tests/` deleted.
- New `features/profile/ui/ImageUploadButton.tsx` — the file-picker control that
  `Cover` and the avatar had each implemented separately (hidden input + ref, the
  `Loader2`/`Camera` swap, disable-while-uploading, and the
  `e.target.value = ""` reset). `variant` is `scrim` (on a photo) or `badge`
  (overlapping an element); the host positions it.

`Primitives/Avatar` grew to cover both call sites:

- `size="xl"` (144px) for the profile header, alongside `sm`/`md`/`lg`.
- `frame`: `overlay` (the nav bar's translucent ring) or `raised` (the profile
  header's white ring and shadow).
- It renders a `<button>` only when `onClick` is given; the profile avatar is
  static, so it is no longer an empty button sitting in the tab order.
- `next/image` `width`/`height` now track the rendered size instead of a fixed
  `100`, so the 144px avatar is no longer upscaled from a 100px request.

| From                                    | To                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `components/SearchBar/SearchBar.tsx`    | `features/search/ui/SearchBar.tsx`                                          |
| `components/AdBanner/`                  | `features/home/ui/AdBanner.tsx`                                             |
| `components/HeroCarousel/`              | `features/home/ui/HeroCarousel.tsx`                                         |
| `components/Header/CustomHeader.tsx`    | `features/navigation/ui/CustomHeader.tsx`                                   |
| `components/Header/HeaderRight.tsx`     | `features/navigation/ui/HeaderRight.tsx`                                    |
| `components/Header/Flag.tsx`            | `features/navigation/ui/Flag.tsx`                                           |
| `components/Header/LocaleSwitcher.tsx`  | `features/navigation/ui/LocaleSwitcher.tsx`                                 |
| `components/Header/ProfileDropdown.tsx` | `features/navigation/ui/ProfileDropdown.tsx` (built on `Overlays/Dropdown`) |
| `components/Header/i18n/`               | merge into `features/navigation/i18n/`                                      |
| `components/SubHeader/`                 | `features/navigation/ui/SubHeader.tsx`                                      |
| `components/Drawer/Drawer.tsx`          | `features/navigation/ui/Drawer.tsx`                                         |
| `components/Drawer/Accordion.tsx`       | `features/navigation/ui/Accordion.tsx`                                      |
| `components/Drawer/MenuRow.tsx`         | `features/navigation/ui/MenuRow.tsx`                                        |
| `components/Drawer/hooks/`              | `features/navigation/hooks/`                                                |
| `components/Drawer/constants/`          | `features/navigation/constants/`                                            |
| `components/Drawer/i18n/`               | merge into `features/navigation/i18n/`                                      |
| `components/Drawer/types/`              | `features/navigation/types/`                                                |

- [ ] `app/[lang]/layout.tsx` imports `components/Drawer` directly — repoint it to
      `@/features/navigation`.
- [ ] Feature subfolders must stay lowercase per the existing lint rule, with PascalCase
      **files** inside `ui/`.

## Phase 8 — `features/product-detail/`

`product` and `store-product` are near-clones. Measured differences after normalising the
`StoreProduct` → `Product` naming:

| Pair                                             | Diff             |
| ------------------------------------------------ | ---------------- |
| `ProductBadges` / `StoreProductBadges`           | **identical**    |
| `ProductImpact` / `StoreProductImpact`           | **identical**    |
| `ProductTrust` / `StoreProductTrust`             | 4 lines          |
| `ProductDescription` / `StoreProductDescription` | 8 lines          |
| `ProductStatus` / `StoreProductStatus`           | 10 lines         |
| `ProductActions` / `StoreProductActions`         | 25 lines         |
| `ProductDetails` / `StoreProductDetails`         | 38 lines         |
| `ProductSummary` / `StoreProductSummary`         | 52 lines         |
| `ProductContent` / `StoreProductContent`         | 84 lines         |
| `OtherFromSeller` / `OtherFromBusiness`          | 109 vs 111 lines |

- [ ] Create `features/product-detail/` as a shared feature module.
- [ ] Move the identical three (`Badges`, `Impact`, `Trust`) as-is.
- [ ] Merge `Status`, `Description`, `Details`, `Actions`, `Summary` into one component
      each with a `variant: "marketplace" | "store"` prop.
- [ ] Merge `OtherFromSeller` + `OtherFromBusiness`.
- [ ] `features/product` and `features/store-product` keep only their screens, hooks,
      i18n and the genuinely divergent `Content` composition.

## Phase 9 — Cleanup & enforcement

- [ ] Delete `components/Card/`, `components/Hero/`, `components/Header/`,
      `components/Identity/`, `components/Drawer/`, `components/BreadCrumbs/`,
      `components/Links/`, `components/Actions/` — all should be empty by now.
- [ ] Confirm zero cross-feature imports remain except into `features/navigation`
      and `features/product-detail` (`features/footer` now lives in
      `components/Footer`, dictionary provided by `app/[lang]/layout.tsx`):
      `    grep -rn '@/features/' features --include=*.tsx --include=*.ts`
- [ ] Audit `"use client"` — 289 of 305 component files carry it today. Layout and
      pattern components that take `children` should mostly be server components.
- [ ] Add an `index.ts` barrel per group folder.
- [ ] Update [ARCHITECTURE.md](./ARCHITECTURE.md) §5 with the `components/<Group>/<Name>/`
      convention and the shared-component i18n rule.
- [ ] Add a CI step running `pnpm test` and `pnpm lint`.

---

## Ordering rationale

Phases 0–2 are the load-bearing ones: without a test runner nothing can be verified as it
moves, and without `Layout/Page` + `Container` the spacing stays inconsistent no matter
how the folders are arranged. Phases 3–6 are mostly mechanical moves that can be done a
component at a time. Phase 8 is the largest and the least urgent — leave it last.
