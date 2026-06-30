"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MapPin } from "lucide-react";
import clsx from "clsx";

import { COUNTRIES_AVAILABLE } from "@/constants/settings";
import { useCountry } from "@/hooks/useCountry";

export default function CountryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [country, changeCountry] = useCountry();

  const close = () => setIsOpen(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = (code: string) => {
    close();
    changeCountry(code);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger — matches the language/cart button style */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change country"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={clsx(
          "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white/10 outline-none transition-all duration-150 hover:border-white/50 hover:bg-white/20 active:scale-95 active:bg-white/30",
          isOpen ? "border-white/50 bg-white/20" : "border-white/25",
        )}
      >
        <MapPin size={18} color="#fff" strokeWidth={1.6} />
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        className={clsx(
          "absolute right-0 top-[calc(100%+10px)] z-49 min-w-44 overflow-hidden rounded-xl bg-surface shadow-xl ring-1 ring-border-light",
          "origin-top-right transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        <div className="py-1.5">
          {COUNTRIES_AVAILABLE.map((c) => {
            const isActive = c.code === country;
            return (
              <button
                key={c.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleSelect(c.code)}
                className="group flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent px-4 py-2.5 text-left transition-colors duration-150 hover:bg-surface-hover"
              >
                <span
                  className={clsx(
                    "text-base transition-colors duration-150",
                    isActive
                      ? "font-semibold text-primary"
                      : "font-medium text-foreground-secondary group-hover:text-foreground",
                  )}
                >
                  {c.name}
                </span>
                {isActive && <Check size={16} strokeWidth={2} className="text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
