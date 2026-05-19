import Link from "next/link";
import React from "react";

export function ExternalLink({
  href,
  children,
  style,
  className,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
