/** A business tag. The UI labels it by id via `editProfile.tags.options.<id>`. */
export interface BusinessTag {
  id: string;
}

/** Maximum number of tags a business may select. */
export const MAX_BUSINESS_TAGS = 3;

// The users subgraph's catalog (BUSINESS_TAG_IDS), used while it loads or if
// the request fails. Only ids are stored here — labels come from i18n.
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
