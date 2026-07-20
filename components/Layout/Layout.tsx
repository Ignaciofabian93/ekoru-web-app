import { clsx } from "clsx";
import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import tokens from "@/design/tokens";

// This module holds only pure, presentational layout primitives — no
// "use client" directive and no server-only imports — so it can be imported
// from both Server and Client Components. The page shell that composes the
// server-only Navigation/Footer lives in ./Screen instead; keeping it out of
// here is what lets client components use these primitives. See [[feature-first-architecture]].
const { spacing } = tokens;

// All gap/padding values come from the shared 8pt spacing scale in
// design/tokens.ts — never a hardcoded px or Tailwind gap-N literal here.
type Gap = Exclude<keyof typeof spacing, "px">;

type Align = "start" | "center" | "end" | "baseline" | "stretch";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";
type Breakpoint = "sm" | "md" | "lg" | "xl";

const ALIGN_CLASSES: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

const JUSTIFY_CLASSES: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

// Same class pair regardless of which side names it: column below the
// breakpoint, row at/above it. Row.stackBelow and Column.rowAbove both read this.
const RESPONSIVE_ROW_CLASSES: Record<Breakpoint, string> = {
  sm: "flex-col sm:flex-row",
  md: "flex-col md:flex-row",
  lg: "flex-col lg:flex-row",
  xl: "flex-col xl:flex-row",
};

function gapStyle(gap: Gap): CSSProperties {
  return { gap: spacing[gap] };
}

interface FlexOwnProps {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

type PolymorphicProps<E extends ElementType, OwnProps> = OwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof OwnProps | "as">;

type RowProps<E extends ElementType> = PolymorphicProps<
  E,
  FlexOwnProps & { wrap?: boolean; stackBelow?: Breakpoint }
>;

function Row<E extends ElementType = "div">({
  as,
  gap = 4,
  align,
  justify,
  wrap,
  stackBelow,
  className,
  style,
  children,
  ...rest
}: RowProps<E>) {
  const Component = as ?? "div";
  return (
    <Component
      className={clsx(
        "flex",
        stackBelow ? RESPONSIVE_ROW_CLASSES[stackBelow] : "flex-row",
        align && ALIGN_CLASSES[align],
        justify && JUSTIFY_CLASSES[justify],
        wrap && "flex-wrap",
        className,
      )}
      style={{ ...gapStyle(gap), ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}

type ColumnProps<E extends ElementType> = PolymorphicProps<
  E,
  FlexOwnProps & { rowAbove?: Breakpoint }
>;

function Column<E extends ElementType = "div">({
  as,
  gap = 4,
  align,
  justify,
  rowAbove,
  className,
  style,
  children,
  ...rest
}: ColumnProps<E>) {
  const Component = as ?? "div";
  return (
    <Component
      className={clsx(
        "flex",
        rowAbove ? RESPONSIVE_ROW_CLASSES[rowAbove] : "flex-col",
        align && ALIGN_CLASSES[align],
        justify && JUSTIFY_CLASSES[justify],
        className,
      )}
      style={{ ...gapStyle(gap), ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}

interface SectionProps {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  className?: string;
  children: ReactNode;
}

function Section({ children, className, gap, align, justify }: SectionProps) {
  return (
    <section
      className={clsx("w-full flex flex-col mt-4 mb-2", className)}
      style={{ gap: spacing[gap ?? 6], alignItems: align, justifyContent: justify }}
    >
      {children}
    </section>
  );
}

type ContainerSize = "default" | "narrow";

const CONTAINER_MAX_WIDTH: Record<ContainerSize, string> = {
  default: "max-w-6xl",
  narrow: "max-w-4xl",
};

const CONTAINER_DEFAULTS: Record<
  ContainerSize,
  { gap: Gap; paddingX: Gap; paddingY: Gap }
> = {
  default: { gap: 12, paddingX: 2, paddingY: 6 },
  narrow: { gap: 5, paddingX: 1, paddingY: 4 },
};

interface ContainerProps {
  size?: ContainerSize;
  gap?: Gap;
  className?: string;
  children: ReactNode;
}

function Container({ size = "default", gap, className, children }: ContainerProps) {
  const defaults = CONTAINER_DEFAULTS[size];
  return (
    <div
      className={clsx(
        "mx-auto flex w-full flex-col",
        CONTAINER_MAX_WIDTH[size],
        className,
      )}
      style={{
        gap: spacing[gap ?? defaults.gap],
        paddingInline: spacing[defaults.paddingX],
        paddingBlock: spacing[defaults.paddingY],
      }}
    >
      {children}
    </div>
  );
}

interface ScreenProps {
  children: ReactNode;
}

function Screen({ children }: ScreenProps) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-white">
      <div className="mx-auto w-full flex-1">{children}</div>
    </main>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

Layout.Row = Row;
Layout.Column = Column;
Layout.Container = Container;
Layout.Screen = Screen;
Layout.Section = Section;
