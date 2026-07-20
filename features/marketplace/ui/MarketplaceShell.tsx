import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  nav: ReactNode;
  hero?: ReactNode;
  children: ReactNode;
}

export function MarketplaceShell({ nav, hero, children }: Props) {
  return (
    <main className="flex-1 bg-background">
      {nav}
      {hero}
      <div className={clsx("mx-auto w-full")}>{children}</div>
    </main>
  );
}
