import { configureAxe } from "vitest-axe";

/**
 * axe for component tests. jsdom has no layout or canvas, so colour contrast
 * cannot be measured here; every structural rule (names, roles, nesting) runs.
 */
export const axe = configureAxe({
  rules: { "color-contrast": { enabled: false } },
});
