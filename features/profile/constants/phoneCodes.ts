// Mapping of country name (matching `Country.country` from the location DB) to
// its dial prefix. Used by the edit-profile form to preselect the phone area
// code based on the seller's saved country, while still letting the user
// override it manually.

export type PhoneCode = {
  /** ISO 3166-1 alpha-2 code, used as an option key */
  iso: string;
  /** Display name in Spanish (matches the database's `country` value) */
  name: string;
  /** International dial prefix without the leading "+" */
  dial: string;
  /** Emoji flag for quick visual recognition */
  flag: string;
};

export const PHONE_CODES: PhoneCode[] = [
  { iso: "AR", name: "Argentina", dial: "54", flag: "🇦🇷" },
  { iso: "BO", name: "Bolivia", dial: "591", flag: "🇧🇴" },
  { iso: "BR", name: "Brasil", dial: "55", flag: "🇧🇷" },
  { iso: "CA", name: "Canadá", dial: "1", flag: "🇨🇦" },
  { iso: "CL", name: "Chile", dial: "56", flag: "🇨🇱" },
  { iso: "CO", name: "Colombia", dial: "57", flag: "🇨🇴" },
  { iso: "CR", name: "Costa Rica", dial: "506", flag: "🇨🇷" },
  { iso: "CU", name: "Cuba", dial: "53", flag: "🇨🇺" },
  { iso: "DO", name: "República Dominicana", dial: "1", flag: "🇩🇴" },
  { iso: "EC", name: "Ecuador", dial: "593", flag: "🇪🇨" },
  { iso: "SV", name: "El Salvador", dial: "503", flag: "🇸🇻" },
  { iso: "ES", name: "España", dial: "34", flag: "🇪🇸" },
  { iso: "US", name: "Estados Unidos", dial: "1", flag: "🇺🇸" },
  { iso: "FR", name: "Francia", dial: "33", flag: "🇫🇷" },
  { iso: "GT", name: "Guatemala", dial: "502", flag: "🇬🇹" },
  { iso: "HN", name: "Honduras", dial: "504", flag: "🇭🇳" },
  { iso: "MX", name: "México", dial: "52", flag: "🇲🇽" },
  { iso: "NI", name: "Nicaragua", dial: "505", flag: "🇳🇮" },
  { iso: "PA", name: "Panamá", dial: "507", flag: "🇵🇦" },
  { iso: "PY", name: "Paraguay", dial: "595", flag: "🇵🇾" },
  { iso: "PE", name: "Perú", dial: "51", flag: "🇵🇪" },
  { iso: "PT", name: "Portugal", dial: "351", flag: "🇵🇹" },
  { iso: "PR", name: "Puerto Rico", dial: "1", flag: "🇵🇷" },
  { iso: "GB", name: "Reino Unido", dial: "44", flag: "🇬🇧" },
  { iso: "UY", name: "Uruguay", dial: "598", flag: "🇺🇾" },
  { iso: "VE", name: "Venezuela", dial: "58", flag: "🇻🇪" },
];

const NAME_TO_CODE: Record<string, PhoneCode> = PHONE_CODES.reduce(
  (acc, code) => {
    acc[code.name.toLowerCase()] = code;
    return acc;
  },
  {} as Record<string, PhoneCode>,
);

/** Returns the dial prefix entry matching a country name, or undefined. */
export function findPhoneCodeByCountryName(name?: string | null): PhoneCode | undefined {
  if (!name) return undefined;
  return NAME_TO_CODE[name.trim().toLowerCase()];
}

/** Splits a phone like "+56912345678" into its dial prefix and remainder. */
export function splitPhone(phone?: string | null): { dial: string; local: string } {
  if (!phone) return { dial: "", local: "" };
  const trimmed = phone.replace(/\s+/g, "").replace(/^\+/, "");
  const match = PHONE_CODES.map((c) => c.dial)
    .sort((a, b) => b.length - a.length)
    .find((d) => trimmed.startsWith(d));
  if (!match) return { dial: "", local: trimmed };
  return { dial: match, local: trimmed.slice(match.length) };
}
