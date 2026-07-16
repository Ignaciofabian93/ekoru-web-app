import { type SupportedLanguage } from "@/constants/settings";
import { Footer } from "@/features/footer/Footer";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface Props {
  lang: SupportedLanguage;
  nav: ReactNode;
  hero?: ReactNode;
  children: ReactNode;
}

export function ScreenShell({ lang, nav, hero, children }: Props) {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-white">
      {nav}
      {hero}
      <div
        className={clsx("mx-auto w-full", "flex-1", {
          "py-8": hero,
          "py-0": !hero,
          "px-2": hero,
          "px-0": !hero,
        })}
      >
        {children}
      </div>
      <Footer lang={lang} />
    </main>
  );
}
