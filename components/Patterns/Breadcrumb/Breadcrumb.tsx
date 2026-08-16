import { ChevronRight } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import {
  breadcrumbButtonClass,
  breadcrumbChevronColor,
  breadcrumbChevronSize,
  breadcrumbItemClass,
  breadcrumbLinkClass,
  breadcrumbNavClass,
} from "@/design/breadcrumb";

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
    <nav aria-label={ariaLabel} className={breadcrumbNavClass}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className={breadcrumbItemClass}>
            {idx > 0 && (
              <ChevronRight
                size={breadcrumbChevronSize}
                aria-hidden
                color={
                  chevronColor === "inverted"
                    ? breadcrumbChevronColor.inverted
                    : breadcrumbChevronColor.default
                }
                strokeWidth={2}
              />
            )}
            {!isLast && item.onPress ? (
              <button
                type="button"
                onClick={item.onPress}
                className={breadcrumbButtonClass}
              >
                <Text
                  size="sm"
                  color={crumbColor === "inverted" ? "white" : "secondary"}
                  className={breadcrumbLinkClass}
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
