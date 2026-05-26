import type { ReactNode } from "react";

interface Props {
  nav: ReactNode;
  children: ReactNode;
}

export function SellerShell({ nav, children }: Props) {
  return (
    <main className="flex-1 bg-background">
      {nav}
      {children}
    </main>
  );
}
