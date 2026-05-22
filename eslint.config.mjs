import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import checkFile from "eslint-plugin-check-file";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),

  {
    rules: {
      // ── TypeScript ──────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // ── React ───────────────────────────────────────────────────
      "react/self-closing-comp": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],

      // ── Imports ─────────────────────────────────────────────────
      "no-duplicate-imports": "error",

      // ── General ─────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // ── Architecture: file & folder structure ─────────────────────────
  // Enforces the feature-first layout. See docs/ARCHITECTURE.md.
  {
    plugins: { "check-file": checkFile },
    rules: {
      // Folders are always lowercase (kebab-case) under app/ and features/,
      // PascalCase under components/.
      "check-file/folder-naming-convention": [
        "error",
        {
          "features/**/": "KEBAB_CASE",
          "app/**/": "NEXT_JS_APP_ROUTER_CASE",
          "components/*/": "PASCAL_CASE",
        },
      ],
    },
  },

  // app/[lang] holds ONLY Next.js route files — no components or logic.
  {
    files: ["app/**/*.{ts,tsx}"],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "app/**/*.{ts,tsx}":
            "@(page|layout|loading|error|not-found|template|default|global-error|route|middleware|sitemap|robots|manifest|opengraph-image|twitter-image|icon|apple-icon)",
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  // Hooks are camelCase (useThing) anywhere they live.
  {
    files: ["**/hooks/**/*.{ts,tsx}"],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "**/hooks/**/*.{ts,tsx}": "CAMEL_CASE" },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  // Component files and feature ui/screen files are PascalCase.
  {
    files: [
      "components/**/*.tsx",
      "features/**/ui/**/*.tsx",
      "features/**/screens/**/*.tsx",
      "features/*/*.tsx",
    ],
    ignores: ["**/hooks/**"],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.tsx": "PASCAL_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
]);

export default eslintConfig;
