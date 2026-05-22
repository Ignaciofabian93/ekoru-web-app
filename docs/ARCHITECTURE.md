# Architecture & Code Style

This project is **feature-first**. Routing lives in `app/`, everything else lives
in a feature. Use [`features/auth`](../features/auth) and
[`features/profile`](../features/profile) as the canonical reference.

Most of the rules below are enforced automatically by ESLint
(`eslint.config.mjs`, via `eslint-plugin-check-file`). The ones marked
**convention** are not machine-checkable yet — follow them by hand and in review.

## 1. `app/[lang]` holds only routes

`app/**` may contain **only** Next.js route files: `page`, `layout`, `loading`,
`error`, `not-found`, `template`, `default`, `global-error`, `route`,
`middleware`, `sitemap`, `robots`, `manifest`, `opengraph-image`,
`twitter-image`, `icon`, `apple-icon`.

No components, hooks, helpers, or business logic. A page is a thin server
component that resolves `params` and renders a feature screen:

```tsx
// app/[lang]/(auth)/login/page.tsx
import { type SupportedLanguage } from "@/constants/settings";
import { Login } from "@/features/auth/screens/Login";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Login lang={lang} />;
}
```

*Enforced:* any non-route filename under `app/**` is a lint error.

## 2. Every page maps to a feature folder

Each page delegates to a feature in `features/<name>/` (e.g. `features/auth`,
`features/profile`). **(convention)**

## 3. Feature folder structure

A feature contains these folders as needed:

```
features/<name>/
  screens/      # one screen component per page (server component, default)
  ui/           # presentational / client building blocks used by screens
  hooks/        # use* hooks (camelCase)
  constants/    # static config, links, options (only if needed)
  i18n/         # index.ts + locales/{en,es,fr}.json
```

`screens` and `i18n` are the backbone; `hooks`, `ui`, and `constants` are added
only when the feature needs them. **(folders enforced lowercase; presence is convention)**

## 4. Screens own the DictionaryProvider

Every screen wraps its content in a `DictionaryProvider` scoped to the feature's
own i18n namespace, with the page content as `children`: **(convention)**

```tsx
// features/auth/screens/Login.tsx
import { DictionaryProvider } from "@/i18n/context";
import { getAuthDictionary, NAMESPACE } from "../i18n";

export async function Login({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAuthDictionary(lang);
  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      {/* screen content */}
    </DictionaryProvider>
  );
}
```

The feature's `i18n/index.ts` exports `NAMESPACE`, a typed dictionary, a
`NestedKeyOf` key type, and a lazy `get<Feature>Dictionary(lang)` loader. Copy
the shape from [`features/auth/i18n/index.ts`](../features/auth/i18n/index.ts).

## 5. Naming conventions

| Path | Rule | Example |
| --- | --- | --- |
| `components/<Name>/` (folders) | **PascalCase** | `components/AdBanner/` |
| `components/**/*.tsx` (component files) | **PascalCase** | `components/AdBanner/AdBanner.tsx` |
| `features/**/ui/*.tsx`, `features/**/screens/*.tsx` | **PascalCase** (file only) | `features/auth/ui/AuthShell.tsx`, `features/auth/screens/Login.tsx` |
| `features/**/` (folders) | **lowercase / kebab-case** | `features/not-found/`, `features/auth/ui/` |
| `**/hooks/*` | **camelCase**, `use*` | `features/auth/hooks/useLogin.ts` |
| `app/**/` (folders) | route-group / dynamic-segment casing | `(auth)`, `[lang]`, `[department]` |

*Enforced:* all rows above are lint errors when violated. i18n locale JSON and
`i18n/index.ts` keep their lowercase names.
