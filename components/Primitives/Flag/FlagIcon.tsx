import clsx from "clsx";
import { flagIconClass } from "@/design/flag";
import CA from "country-flag-icons/react/3x2/CA";
import CL from "country-flag-icons/react/3x2/CL";
import AR from "country-flag-icons/react/3x2/AR";
import US from "country-flag-icons/react/3x2/US";

/**
 * Flags for the markets we serve. Keep this in sync with SUPPORTED_COUNTRIES —
 * add the matching `country-flag-icons` import when a new market opens. Importing
 * flags individually (instead of the whole set) keeps them out of the bundle
 * until they're actually offered.
 */
const FLAGS: Record<string, typeof CL> = { CA, CL, AR, US };

/**
 * Renders a country flag from its ISO 3166-1 alpha-2 code. Decorative by
 * default (the surrounding control provides the label); pass `title` to expose
 * an accessible name. Returns nothing for codes without a registered flag.
 */
export function FlagIcon({
  country,
  className,
  title,
}: {
  country: string;
  className?: string;
  title?: string;
}) {
  const Icon = FLAGS[country.toUpperCase()];
  if (!Icon) return null;

  return (
    <Icon
      title={title}
      aria-hidden={title ? undefined : true}
      className={clsx(flagIconClass, className)}
    />
  );
}
