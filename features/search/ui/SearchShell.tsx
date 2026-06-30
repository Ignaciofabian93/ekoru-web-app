import type { ReactNode } from "react";

interface Props {
  nav: ReactNode;
  children: ReactNode;
}

export function SearchShell({ nav, children }: Props) {
  return (
    <main className="flex-1 bg-background">
      {nav}
      <div className="mx-auto w-full max-w-5xl px-4 py-8">{children}</div>
    </main>
  );
}
