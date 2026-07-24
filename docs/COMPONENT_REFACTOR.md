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

| Used by | Has domain logic | Goes to |
| --- | --- | --- |
| 1 feature | either | `features/<name>/ui/` |
| 2+ features | no | `components/<Group>/` |
| 2+ features | yes | shared feature module consumed by both |

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

- [ ] Update `eslint.config.mjs` folder rules for the new nesting. `components/*/` only
      checks one level, so component folders inside a group go unchecked. Replace with:
      ```js
      "components/*/": "PASCAL_CASE",    // group folders
      "components/*/*/": "PASCAL_CASE",  // component folders
      ```
      Do **not** use `components/**/` — it would flag the lowercase `i18n/`, `locales/`,
      `hooks/`, `constants/` and `types/` subfolders.
- [ ] Rename `components/overlays/` → `components/Overlays/` (created lowercase by mistake).
- [ ] Add the test runner — there is none today. `vitest`, `@testing-library/react`,
      `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest-axe`, `jsdom`.
- [ ] Add `vitest.config.ts` with the `@/*` path alias mirrored from `tsconfig.json`.
- [ ] Add `"test"` and `"test:watch"` scripts to `package.json`.
- [ ] Write `test/renderWithDict.tsx` — a helper that wraps a component in
      `DictionaryProvider` for a given locale, so a11y tests can loop `["en","es","fr"]`.
- [ ] Delete the two empty placeholder dirs: `components/Drawer/test/`,
      `components/Identity/tests/`.

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
- [ ] `components/Identity/NavAvatar.tsx`
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

| New | Source | Replaces |
| --- | --- | --- |
| `Layout/Page/` | new | `Layout/ScreenShell.tsx`, `Layout.Screen`, `features/marketplace/ui/MarketplaceShell.tsx`, `features/product/ui/ProductShell.tsx`, `features/seller/ui/SellerShell.tsx`, `features/search/ui/SearchShell.tsx`, `features/store-product/ui/StoreProductShell.tsx`, `features/publish/ui/PublishShell.tsx` |
| `Layout/Container/` | `Layout/Layout.tsx` (`Container`) | `Layout/ContentLayout.tsx` (`ContentLayout` + `InnerContentLayout`) |
| `Layout/Section/` | `Layout/Layout.tsx` (`Section`) | ad-hoc `<section>` wrappers |
| `Layout/Stack/` | `Layout/Layout.tsx` (`Row` + `Column`) | — |
| `Layout/Grid/` | `Layout/ProductListGrid.tsx` | 4 hand-rolled grids (gaps `2`, `2.5`, `4`) |
| `Layout/Divider/` | new | inline `<hr>` in `AuthShell` and others |

- [ ] Create the six folders above with the full file contract.
- [ ] Migrate all 7 shells onto `Page`.
- [ ] `features/auth/ui/AuthShell.tsx` — keep as a feature shell (genuinely bespoke
      two-column layout), but compose it from `Page` + `Container`.
- [ ] Delete `Layout/Layout.tsx`, `Layout/ContentLayout.tsx`, `Layout/ScreenShell.tsx`,
      `Layout/ProductListGrid.tsx` once all consumers move.

## Phase 3 — Primitives

| From | To |
| --- | --- |
| `components/Button/MainButton.tsx` | `Primitives/Button/Button.tsx` (rename) |
| `components/Text/Text.tsx` | `Primitives/Text/` |
| `components/Title/Title.tsx` | `Primitives/Title/` |
| `components/Input/Input.tsx` | `Primitives/Input/` |
| `components/TextArea/TextArea.tsx` | `Primitives/TextArea/` |
| `components/Select/Select.tsx` | `Primitives/Select/` (15 consumers — highest churn) |
| `components/Checkbox/Checkbox.tsx` | `Primitives/Checkbox/` |
| `components/Badge/Badge.tsx` | `Primitives/Badge/` |
| `components/Identity/Avatar.tsx` | `Primitives/Avatar/` |
| `components/Links/LinkButton.tsx` | `Primitives/LinkButton/` |
| `components/EkoruLogo/` | `Primitives/EkoruLogo/` (keep its `i18n/` and `ui/` subfolders) |

New primitives to write:

- [ ] `Primitives/Toggle/` — promote `features/profile/ui/Toggle.tsx`
- [ ] `Primitives/Skeleton/` — the `aspect-3/4 animate-pulse rounded-xl` block is
      copy-pasted in 4 grids
- [ ] `Primitives/IconButton/` — the circular icon button is re-implemented in
      `SellerHero`, `ProductActions` and `StoreProductActions`

- [ ] Backfill `*.test.tsx` + `*.a11y.test.tsx` for each as you move it.
- [ ] Delete `components/Identity/` once `Avatar` moves and `Cover` leaves (Phase 7).

## Phase 4 — Patterns

| New / moved | Replaces |
| --- | --- |
| `Patterns/PageHero/` | 5 byte-identical clones: `features/blog/ui/BlogHero.tsx`, `features/community/ui/CommunityHero.tsx`, `features/services/ui/ServicesHero.tsx`, `features/stores/ui/StoreHero.tsx`, `features/marketplace/ui/Hero.tsx` |
| `Patterns/BreadcrumbHero/` | 5 byte-identical clones: `BlogInnerHero`, `CommunityInnerHero`, `ServiceInnerHero`, `StoreInnerHero`, `marketplace/ui/InnerHero` |
| `Patterns/GradientHeader/` | `components/ScreenHeader/ScreenHeader.tsx` (rename) |
| `Patterns/SectionHeader/` | `features/home/ui/Wrapper.tsx` + inline `h2`/`p` blocks in `SellerCatalog`, `ListingsPanel`, `SectionCard` |
| `Patterns/ResultsGrid/` | `features/marketplace/ui/ProductGrid.tsx`, `features/stores/ui/StoreProductGrid.tsx`, `features/search/ui/SearchResultsGrid.tsx` — one component taking `items` / `loading` / `renderItem` / `emptyIcon` |
| `Patterns/Breadcrumb/` | `components/BreadCrumbs/Breadcrumb.tsx` (fixes the `BreadCrumbs` folder casing) |
| `Patterns/Pagination/` | `components/Pagination/` (9 consumers) |
| `Patterns/Tabs/` | `components/UnderlineTabs/` (9 consumers) + the pill tabs re-implemented inside `features/profile/ui/FavoritesGrid.tsx` |
| `Patterns/CardScroller/` | `components/Card/CardScroller/` (6 consumers) |
| `Patterns/ProductGallery/` | `features/product/ui/ProductGallery.tsx` — promote; `store-product` currently imports the `components/` duplicate |
| `Patterns/StatTile/` | the impact/stat tiles in `StatsSection`, `ImpactSnapshot`, `SellerStats`, `ActivitySnapshot` |

- [ ] `Patterns/SectionHeader` must **not** carry over `Wrapper.tsx`'s interpolated
      classes (`items-${align}`, `flex-${direction}`). Tailwind never compiles those —
      they are dead strings today. Use explicit class maps like `Layout.tsx` does.
- [ ] `PageHero` takes `title` / `subtitle` as strings, not `titleKey` — the clones only
      differ by which feature namespace they read.
- [ ] Reconcile `PageHero`'s max width: 4 clones use `max-w-5xl`, `StoreHero` uses
      `max-w-4xl`. Pick one.

## Phase 5 — Cards

| From | To |
| --- | --- |
| `components/Card/MarketplaceCard/` | `Cards/MarketplaceCard/` |
| `components/Card/StoreProductCard/` | `Cards/StoreProductCard/` |
| `components/Card/ServiceCard/` | `Cards/ServiceCard/` |
| `components/Card/SellerCard/` | `Cards/SellerCard/` |
| `components/Card/StoreCard/` | `Cards/StoreCard/` |
| `components/Card/ServiceProviderCard/` | `Cards/ServiceProviderCard/` |
| `components/Card/shared/ProductImpactBack.tsx` | `Cards/ProductImpactBack/` |

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

## Phase 6 — Overlays & Feedback

| From | To |
| --- | --- |
| `components/Modal/Modal.tsx` | `Overlays/Modal/` (7 consumers) |
| `components/Toast/Toast.tsx` + `ToastProvider.tsx` | `Feedback/Toast/` (mounted in `app/[lang]/layout.tsx`) |

New:

- [ ] `Overlays/Dropdown/` — extract from `components/Header/ProfileDropdown.tsx` and
      `features/profile/ui/ProductActionsMenu.tsx`
- [ ] `Overlays/ConfirmDialog/` — extract from `features/profile/ui/DeleteProductDialog.tsx`
- [ ] `Feedback/EmptyState/` — **one** component with `compact` / `default` / `action`
      variants, replacing four: `features/community/ui/DetailEmptyState.tsx`,
      `features/services/ui/DetailEmptyState.tsx`, `features/profile/ui/EmptyState.tsx`,
      `features/cart/ui/EmptyCart.tsx`, plus the inline empty blocks in the three grids
- [ ] `Feedback/ErrorState/`
- [ ] `Feedback/SkeletonGrid/`

## Phase 7 — Move feature-only components out of `components/`

These have exactly one consuming feature, so by the placement rule they belong to it.

| From | To |
| --- | --- |
| `components/SearchBar/SearchBar.tsx` | `features/search/ui/SearchBar.tsx` |
| `components/Input/Search.tsx` | `features/search/ui/SearchInput.tsx` |
| `components/EnvironmentalImpactModal/` | `features/profile/ui/EnvironmentalImpactModal.tsx` |
| `components/AdBanner/` | `features/home/ui/AdBanner.tsx` |
| `components/HeroCarousel/` | `features/home/ui/HeroCarousel.tsx` |
| `components/Identity/Cover.tsx` | `features/profile/ui/Cover.tsx` |
| `components/Header/CustomHeader.tsx` | `features/navigation/ui/CustomHeader.tsx` |
| `components/Header/HeaderRight.tsx` | `features/navigation/ui/HeaderRight.tsx` |
| `components/Header/Flag.tsx` | `features/navigation/ui/Flag.tsx` |
| `components/Header/LocaleSwitcher.tsx` | `features/navigation/ui/LocaleSwitcher.tsx` |
| `components/Header/ProfileDropdown.tsx` | `features/navigation/ui/ProfileDropdown.tsx` (built on `Overlays/Dropdown`) |
| `components/Header/i18n/` | merge into `features/navigation/i18n/` |
| `components/SubHeader/` | `features/navigation/ui/SubHeader.tsx` |
| `components/Drawer/Drawer.tsx` | `features/navigation/ui/Drawer.tsx` |
| `components/Drawer/Accordion.tsx` | `features/navigation/ui/Accordion.tsx` |
| `components/Drawer/MenuRow.tsx` | `features/navigation/ui/MenuRow.tsx` |
| `components/Drawer/hooks/` | `features/navigation/hooks/` |
| `components/Drawer/constants/` | `features/navigation/constants/` |
| `components/Drawer/i18n/` | merge into `features/navigation/i18n/` |
| `components/Drawer/types/` | `features/navigation/types/` |

- [ ] `app/[lang]/layout.tsx` imports `components/Drawer` directly — repoint it to
      `@/features/navigation`.
- [ ] Feature subfolders must stay lowercase per the existing lint rule, with PascalCase
      **files** inside `ui/`.

## Phase 8 — `features/product-detail/`

`product` and `store-product` are near-clones. Measured differences after normalising the
`StoreProduct` → `Product` naming:

| Pair | Diff |
| --- | --- |
| `ProductBadges` / `StoreProductBadges` | **identical** |
| `ProductImpact` / `StoreProductImpact` | **identical** |
| `ProductTrust` / `StoreProductTrust` | 4 lines |
| `ProductDescription` / `StoreProductDescription` | 8 lines |
| `ProductStatus` / `StoreProductStatus` | 10 lines |
| `ProductActions` / `StoreProductActions` | 25 lines |
| `ProductDetails` / `StoreProductDetails` | 38 lines |
| `ProductSummary` / `StoreProductSummary` | 52 lines |
| `ProductContent` / `StoreProductContent` | 84 lines |
| `OtherFromSeller` / `OtherFromBusiness` | 109 vs 111 lines |

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
- [ ] Confirm zero cross-feature imports remain except into `features/navigation`,
      `features/footer` and `features/product-detail`:
      ```
      grep -rn '@/features/' features --include=*.tsx --include=*.ts
      ```
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
