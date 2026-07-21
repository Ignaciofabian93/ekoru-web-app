import { Text } from "@/components/Text/Text";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  crumbColor?: "default" | "inverted";
  chevronColor?: "default" | "inverted";
}

export default function Breadcrumb({ items, crumbColor, chevronColor }: Props) {
  return (
    <nav className="flex flex-row flex-wrap items-center ml-2 mb-6 -mt-2">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex flex-row items-center gap-1">
            {idx > 0 && (
              <ChevronRight
                size={12}
                color={chevronColor === "inverted" ? "white" : "#94a3b8"}
                strokeWidth={2}
              />
            )}
            {!isLast && item.onPress ? (
              <button onClick={item.onPress} className="cursor-pointer px-0 py-0.5">
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
