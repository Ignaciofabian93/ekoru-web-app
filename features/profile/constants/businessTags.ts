export interface BusinessTag {
  id: string;
  /**
   * Server-provided label. When absent (fallback list), the UI resolves a
   * localized label by id via `editProfile.tags.options.<id>`.
   */
  label?: string | null;
}

/** Maximum number of tags a business may select. */
export const MAX_BUSINESS_TAGS = 3;

// Fallback eco descriptors shown until the users subgraph exposes real tag data.
// Only ids are stored here — labels come from i18n so all locales stay in sync.
export const FALLBACK_BUSINESS_TAGS: BusinessTag[] = [
  { id: "womanLed" },
  { id: "zeroWaste" },
  { id: "recycledMaterials" },
  { id: "plasticFree" },
  { id: "locallyMade" },
  { id: "handmade" },
  { id: "vegan" },
  { id: "crueltyFree" },
  { id: "organic" },
  { id: "fairTrade" },
  { id: "carbonNeutral" },
  { id: "upcycled" },
  { id: "refillable" },
  { id: "biodegradable" },
];
