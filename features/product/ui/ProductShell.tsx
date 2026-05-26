import type { ReactNode } from "react";

interface Props {
  nav: ReactNode;
  breadcrumbs?: ReactNode;
  children: ReactNode;
}

export function ProductShell({ nav, breadcrumbs, children }: Props) {
  return (
    <main className="flex-1 bg-background">
      {nav}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        {breadcrumbs}
        <div className="mt-4">{children}</div>
      </div>
    </main>
  );
}
