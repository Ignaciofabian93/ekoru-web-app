import clsx from "clsx";
import CA from "country-flag-icons/react/3x2/CA";
import CL from "country-flag-icons/react/3x2/CL";

/**
 * Flags for the markets we serve. Keep this in sync with SUPPORTED_COUNTRIES —
 * add the matching `country-flag-icons` import when a new market opens. Importing
 * flags individually (instead of the whole set) keeps them out of the bundle
 * until they're actually offered.
 */
const FLAGS: Record<string, typeof CL> = { CA, CL };

/**
 * Renders a country flag from its ISO 3166-1 alpha-2 code. Decorative by
 * default (the surrounding control provides the label); pass `title` to expose
 * an accessible name. Returns nothing for codes without a registered flag.
 */
export function Flag({
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
      className={clsx("inline-block object-cover", className)}
    />
  );
}
