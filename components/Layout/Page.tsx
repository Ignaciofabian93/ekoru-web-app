import type { ReactNode } from "react";
import { Footer } from "../Footer";
import { NavBar } from "../Navigation";
import { Container } from "./Container";
import { MAIN_CONTENT_ID, RHYTHM, type Gap, type Width } from "./tokens";

interface PageLayoutProps {
  children: ReactNode;
  /** Full-bleed block between the navbar and the page body (hero, carousel). */
  hero?: ReactNode;
  /** Content width. Every screen re-pins to one of the three page widths. */
  width?: Width;
  /** Vertical gap between the body's direct children (usually `Section`s). */
  gap?: Gap;
  /**
   * Set false when the body renders its own containers — the children then span
   * the full viewport width.
   */
  contained?: boolean;
  /** Pass `null` to opt out of the shared navbar, or a node to replace it. */
  nav?: ReactNode;
  /** Pass `null` to opt out of the shared footer, or a node to replace it. */
  footer?: ReactNode;
  className?: string;
}

/**
 * The page shell every screen sits in: navbar, optional hero, the content
 * column, footer.
 *
 * The navbar and footer sit *outside* `<main>` on purpose — a `<header>` nested
 * inside `<main>` loses its banner role, which is what the previous shells did.
 * With them hoisted out, the landmarks read banner › main › contentinfo and the
 * navbar's skip link has a real target to jump to.
 */
export function PageLayout({
  children,
  hero,
  width = "default",
  gap = RHYTHM.SECTION,
  contained = true,
  nav = <NavBar />,
  footer = <Footer />,
  className,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {nav}
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex w-full flex-1 flex-col">
        {hero}
        {contained ? (
          <Container width={width} gap={gap} className={className}>
            {children}
          </Container>
        ) : (
          children
        )}
      </main>
      {footer}
    </div>
  );
}
