import { Text } from "@/components/Text/Text";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="mb-5 flex flex-row flex-wrap items-center gap-x-0.5 gap-y-1 py-0.5">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex flex-row items-center gap-1">
            {idx > 0 && (
              <ChevronRight
                size={12}
                color="currentColor"
                strokeWidth={2}
                className="text-foreground-tertiary"
              />
            )}
            {!isLast && item.onPress ? (
              <button onClick={item.onPress} className="cursor-pointer px-0 py-0.5">
                <Text size="sm" color="secondary" className="underline">
                  {item.label}
                </Text>
              </button>
            ) : (
              <Text
                size="sm"
                weight={isLast ? "semibold" : "normal"}
                color={isLast ? "default" : "tertiary"}
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
