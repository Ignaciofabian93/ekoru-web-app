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
      <div className="mx-auto w-full max-w-4xl px-4 py-8">{children}</div>
    </main>
  );
}
