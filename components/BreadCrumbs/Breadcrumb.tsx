import { Text } from "@/components/Text/Text";
import { colors } from "@/design/tokens";
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
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 4,
        columnGap: 2,
        marginBottom: 20,
        paddingBlock: 2,
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div
            key={idx}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            {idx > 0 && (
              <ChevronRight size={12} color={colors.foregroundTertiary} strokeWidth={2} />
            )}
            {!isLast && item.onPress ? (
              <button
                onClick={item.onPress}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px 0",
                  cursor: "pointer",
                }}
              >
                <Text size="sm" style={{ color: colors.foregroundSecondary, textDecoration: "underline" }}>
                  {item.label}
                </Text>
              </button>
            ) : (
              <Text
                size="sm"
                weight={isLast ? "semibold" : "normal"}
                style={{ color: isLast ? colors.foreground : colors.foregroundTertiary }}
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
