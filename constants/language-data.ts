import {
  DEFAULT_COUNTRY,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "./settings";

/**
 * Native / official languages per country (ISO 3166-1 alpha-2 → ISO 639-1).
 *
 * This is the source of truth for which languages are *culturally consistent*
 * with a country — it is intentionally geographic and NOT limited to the
 * languages the app UI ships. Most of these codes aren't served yet; use
 * {@link getLanguagesForCountry} to get the options the language switcher may
 * actually show for a given location.
 *
 * When a country has several official languages, the most widely used one is
 * listed first.
 */
export const LANGUAGES_BY_COUNTRY: Record<string, string[]> = {
  // ── North America ───────────────────────────────────────────────
  CA: ["en", "fr"], // Canada
  US: ["en", "es"], // United States
  MX: ["es"], // Mexico

  // ── Central America ─────────────────────────────────────────────
  BZ: ["en"], // Belize
  CR: ["es"], // Costa Rica
  SV: ["es"], // El Salvador
  GT: ["es"], // Guatemala
  HN: ["es"], // Honduras
  NI: ["es"], // Nicaragua
  PA: ["es"], // Panama

  // ── Caribbean ───────────────────────────────────────────────────
  AG: ["en"], // Antigua and Barbuda
  BS: ["en"], // Bahamas
  BB: ["en"], // Barbados
  CU: ["es"], // Cuba
  DM: ["en"], // Dominica
  DO: ["es"], // Dominican Republic
  GD: ["en"], // Grenada
  HT: ["fr", "ht"], // Haiti
  JM: ["en"], // Jamaica
  KN: ["en"], // Saint Kitts and Nevis
  LC: ["en"], // Saint Lucia
  VC: ["en"], // Saint Vincent and the Grenadines
  TT: ["en"], // Trinidad and Tobago
  PR: ["es", "en"], // Puerto Rico (territory)

  // ── South America ───────────────────────────────────────────────
  AR: ["es"], // Argentina
  BO: ["es"], // Bolivia
  BR: ["pt"], // Brazil
  CL: ["es"], // Chile
  CO: ["es"], // Colombia
  EC: ["es"], // Ecuador
  GY: ["en"], // Guyana
  PY: ["es"], // Paraguay
  PE: ["es"], // Peru
  SR: ["nl"], // Suriname
  UY: ["es"], // Uruguay
  VE: ["es"], // Venezuela

  // ── Europe ──────────────────────────────────────────────────────
  AL: ["sq"], // Albania
  AD: ["ca"], // Andorra
  AT: ["de"], // Austria
  BY: ["be", "ru"], // Belarus
  BE: ["nl", "fr", "de"], // Belgium
  BA: ["bs", "hr", "sr"], // Bosnia and Herzegovina
  BG: ["bg"], // Bulgaria
  HR: ["hr"], // Croatia
  CY: ["el", "tr"], // Cyprus
  CZ: ["cs"], // Czechia
  DK: ["da"], // Denmark
  EE: ["et"], // Estonia
  FI: ["fi", "sv"], // Finland
  FR: ["fr"], // France
  DE: ["de"], // Germany
  GR: ["el"], // Greece
  HU: ["hu"], // Hungary
  IS: ["is"], // Iceland
  IE: ["en", "ga"], // Ireland
  IT: ["it"], // Italy
  XK: ["sq", "sr"], // Kosovo (user-assigned code)
  LV: ["lv"], // Latvia
  LI: ["de"], // Liechtenstein
  LT: ["lt"], // Lithuania
  LU: ["lb", "fr", "de"], // Luxembourg
  MT: ["mt", "en"], // Malta
  MD: ["ro"], // Moldova
  MC: ["fr"], // Monaco
  ME: ["sr"], // Montenegro
  NL: ["nl"], // Netherlands
  MK: ["mk"], // North Macedonia
  NO: ["no"], // Norway
  PL: ["pl"], // Poland
  PT: ["pt"], // Portugal
  RO: ["ro"], // Romania
  RU: ["ru"], // Russia
  SM: ["it"], // San Marino
  RS: ["sr"], // Serbia
  SK: ["sk"], // Slovakia
  SI: ["sl"], // Slovenia
  ES: ["es"], // Spain
  SE: ["sv"], // Sweden
  CH: ["de", "fr", "it"], // Switzerland (fixed: was mislabelled SZ)
  UA: ["uk"], // Ukraine
  GB: ["en"], // United Kingdom
  VA: ["it"], // Vatican City

  // ── Africa ──────────────────────────────────────────────────────
  DZ: ["ar"], // Algeria
  AO: ["pt"], // Angola
  BJ: ["fr"], // Benin
  BW: ["en"], // Botswana
  BF: ["fr"], // Burkina Faso
  BI: ["fr", "rn"], // Burundi
  CV: ["pt"], // Cabo Verde
  CM: ["fr", "en"], // Cameroon
  CF: ["fr"], // Central African Republic
  TD: ["fr", "ar"], // Chad
  KM: ["ar", "fr"], // Comoros
  CG: ["fr"], // Congo (Republic)
  CD: ["fr"], // DR Congo
  CI: ["fr"], // Côte d'Ivoire
  DJ: ["fr", "ar"], // Djibouti
  EG: ["ar"], // Egypt
  GQ: ["es", "fr", "pt"], // Equatorial Guinea
  ER: ["ti", "ar", "en"], // Eritrea
  SZ: ["en"], // Eswatini (formerly Swaziland — this is the real SZ)
  ET: ["am"], // Ethiopia
  GA: ["fr"], // Gabon
  GM: ["en"], // Gambia
  GH: ["en"], // Ghana
  GN: ["fr"], // Guinea
  GW: ["pt"], // Guinea-Bissau
  KE: ["sw", "en"], // Kenya
  LS: ["en", "st"], // Lesotho
  LR: ["en"], // Liberia
  LY: ["ar"], // Libya
  MG: ["mg", "fr"], // Madagascar
  MW: ["en", "ny"], // Malawi
  ML: ["fr"], // Mali
  MR: ["ar"], // Mauritania
  MU: ["en", "fr"], // Mauritius
  MA: ["ar"], // Morocco
  MZ: ["pt"], // Mozambique
  NA: ["en"], // Namibia
  NE: ["fr"], // Niger
  NG: ["en"], // Nigeria
  RW: ["rw", "fr", "en"], // Rwanda
  ST: ["pt"], // São Tomé and Príncipe
  SN: ["fr"], // Senegal
  SC: ["en", "fr"], // Seychelles
  SL: ["en"], // Sierra Leone
  SO: ["so", "ar"], // Somalia
  ZA: ["en", "af", "zu"], // South Africa
  SS: ["en"], // South Sudan
  SD: ["ar", "en"], // Sudan
  TZ: ["sw", "en"], // Tanzania
  TG: ["fr"], // Togo
  TN: ["ar"], // Tunisia
  UG: ["en", "sw"], // Uganda
  ZM: ["en"], // Zambia
  ZW: ["en"], // Zimbabwe

  // ── Middle East / West Asia ─────────────────────────────────────
  AM: ["hy"], // Armenia
  AZ: ["az"], // Azerbaijan
  BH: ["ar"], // Bahrain
  GE: ["ka"], // Georgia
  IR: ["fa"], // Iran
  IQ: ["ar"], // Iraq
  IL: ["he"], // Israel
  JO: ["ar"], // Jordan
  KW: ["ar"], // Kuwait
  LB: ["ar"], // Lebanon
  OM: ["ar"], // Oman
  PS: ["ar"], // Palestine
  QA: ["ar"], // Qatar
  SA: ["ar"], // Saudi Arabia
  SY: ["ar"], // Syria
  TR: ["tr"], // Turkey
  AE: ["ar"], // United Arab Emirates
  YE: ["ar"], // Yemen

  // ── Central & South Asia ────────────────────────────────────────
  AF: ["fa", "ps"], // Afghanistan
  BD: ["bn"], // Bangladesh
  BT: ["dz"], // Bhutan
  IN: ["hi", "en"], // India
  KZ: ["kk", "ru"], // Kazakhstan
  KG: ["ky", "ru"], // Kyrgyzstan
  MV: ["dv"], // Maldives
  NP: ["ne"], // Nepal
  PK: ["ur", "en"], // Pakistan
  LK: ["si", "ta"], // Sri Lanka
  TJ: ["tg"], // Tajikistan
  TM: ["tk"], // Turkmenistan
  UZ: ["uz"], // Uzbekistan

  // ── East & Southeast Asia ───────────────────────────────────────
  BN: ["ms"], // Brunei
  KH: ["km"], // Cambodia
  CN: ["zh"], // China
  HK: ["zh", "en"], // Hong Kong (territory)
  ID: ["id"], // Indonesia
  JP: ["ja"], // Japan
  LA: ["lo"], // Laos
  MO: ["zh", "pt"], // Macao (territory)
  MY: ["ms"], // Malaysia
  MN: ["mn"], // Mongolia
  MM: ["my"], // Myanmar
  KP: ["ko"], // North Korea
  PH: ["en", "tl"], // Philippines
  SG: ["en", "zh", "ms", "ta"], // Singapore
  KR: ["ko"], // South Korea
  TW: ["zh"], // Taiwan
  TH: ["th"], // Thailand
  TL: ["pt"], // Timor-Leste
  VN: ["vi"], // Vietnam

  // ── Oceania ─────────────────────────────────────────────────────
  AU: ["en"], // Australia
  FJ: ["en"], // Fiji
  KI: ["en"], // Kiribati
  MH: ["en"], // Marshall Islands
  FM: ["en"], // Micronesia
  NR: ["en"], // Nauru
  NZ: ["en", "mi"], // New Zealand
  PW: ["en"], // Palau
  PG: ["en"], // Papua New Guinea
  WS: ["en", "sm"], // Samoa
  SB: ["en"], // Solomon Islands
  TO: ["en", "to"], // Tonga
  TV: ["en"], // Tuvalu
  VU: ["bi", "en", "fr"], // Vanuatu
};

const isSupportedLanguage = (code: string): code is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(code);

/**
 * App-supported UI languages that are consistent with the given country, so the
 * language switcher only offers choices that match the selected location — e.g.
 * Brazil never offers German or French.
 *
 * Resolution order:
 *  1. The country's native languages that the app actually ships.
 *  2. If none are shipped (e.g. Brazil → `pt`, which the UI doesn't have yet),
 *     fall back to English + the default language so the switcher is never empty.
 *  3. Unknown countries fall back to the default country's languages.
 */
export function getLanguagesForCountry(country: string): SupportedLanguage[] {
  const native = LANGUAGES_BY_COUNTRY[country] ?? LANGUAGES_BY_COUNTRY[DEFAULT_COUNTRY] ?? [];
  const consistent = native.filter(isSupportedLanguage);
  if (consistent.length > 0) return consistent;

  const fallback = ["en", DEFAULT_LANGUAGE].filter(isSupportedLanguage);
  return fallback.length > 0 ? Array.from(new Set(fallback)) : [DEFAULT_LANGUAGE];
}
