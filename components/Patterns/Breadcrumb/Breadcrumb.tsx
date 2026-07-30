import { ChevronRight } from "lucide-react";
import { Text } from "@/components/Primitives/Text";

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  crumbColor?: "default" | "inverted";
  chevronColor?: "default" | "inverted";
  /** Accessible name for the nav landmark, e.g. "Breadcrumb". */
  ariaLabel?: string;
}

export function Breadcrumb({
  items,
  crumbColor,
  chevronColor,
  ariaLabel,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-row flex-wrap items-center ml-2 mb-6 -mt-2"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex flex-row items-center gap-1">
            {idx > 0 && (
              <ChevronRight
                size={12}
                aria-hidden
                color={chevronColor === "inverted" ? "white" : "#94a3b8"}
                strokeWidth={2}
              />
            )}
            {!isLast && item.onPress ? (
              <button
                type="button"
                onClick={item.onPress}
                className="cursor-pointer px-0 py-0.5"
              >
                <Text
                  size="sm"
                  color={crumbColor === "inverted" ? "white" : "secondary"}
                  className="underline"
                >
                  {item.label}
                </Text>
              </button>
            ) : (
              <Text
                size="sm"
                weight={isLast ? "semibold" : "normal"}
                color={
                  isLast && crumbColor === "inverted"
                    ? "white"
                    : isLast
                      ? "default"
                      : "tertiary"
                }
              >
                {item.label}
              </Text>
            )}
          </div>
        );
      })}
    </nav>
  );
}
