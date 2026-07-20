import clsx from "clsx";

interface SectionTitleWrapperProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between" | "evenly";
  direction?: "row" | "col";
}

export function SectionTitleWrapper({
  children,
  className,
  align = "center",
  justify = "center",
  direction = "col",
}: SectionTitleWrapperProps) {
  const alignClass = `items-${align}`;
  const justifyClass = `justify-${justify}`;
  const directionClass = `flex-${direction}`;
  return (
    <div
      className={clsx(
        "w-full flex gap-2 px-2",
        alignClass,
        justifyClass,
        directionClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
