import type { ReactNode } from "react";

interface Props {
  nav: ReactNode;
  children: ReactNode;
}

export function ProductShell({ nav, children }: Props) {
  return (
    <main className="flex-1 bg-background">
      {nav}
      <div className="mx-auto w-full max-w-4xl">{children}</div>
    </main>
  );
}
