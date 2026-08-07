/**
 * The document, described as data. Every clause resolves its copy from the
 * `termsAndConditions` dictionary by convention: `<key>Title` and `<key>Body`.
 *
 * The keys are the flat `s1`…`s12` scheme used by the informative site
 * (`informative-web/features/terms-and-policies`), which is where this text is
 * maintained — keeping them identical is what makes the two dictionaries
 * diffable when the legal copy changes. Adding a clause is one entry here plus
 * its title/body in the three locales.
 */
export type TermsSection =
  /** Title + body paragraphs (paragraphs split on a blank line). */
  | { key: string; kind: "prose" }
  /** Title + intro, a bulleted list of `items` keys, then a closing line. */
  | { key: string; kind: "definitions"; items: readonly string[] }
  /** Title + intro, then nested `<key>Title`/`<key>Body` blocks. */
  | { key: string; kind: "subsections"; items: readonly string[] };

export const TERMS_SECTIONS: readonly TermsSection[] = [
  { key: "s1", kind: "prose" },
  {
    key: "s2",
    kind: "definitions",
    items: ["s2Platform", "s2User", "s2Content", "s2Services", "s2Data"],
  },
  { key: "s3", kind: "prose" },
  { key: "s4", kind: "prose" },
  {
    key: "s5",
    kind: "subsections",
    items: ["s51", "s52", "s53", "s54", "s55"],
  },
  { key: "s6", kind: "prose" },
  { key: "s7", kind: "prose" },
  { key: "s8", kind: "prose" },
  { key: "s9", kind: "prose" },
  { key: "s10", kind: "prose" },
  { key: "s11", kind: "prose" },
  { key: "s12", kind: "prose" },
] as const;
