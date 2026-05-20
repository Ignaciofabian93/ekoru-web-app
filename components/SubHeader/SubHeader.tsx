"use client";
import { type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Item = {
  key: string;
  route: string;
  icon: LucideIcon;
  label: string;
};

interface SubHeaderProps {
  subheaderLinks: Item[];
}

export default function SubHeader({ subheaderLinks }: SubHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = subheaderLinks.findIndex((item) => pathname.startsWith(item.route));

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl && scrollRef.current) {
      const container = scrollRef.current;
      const offset =
        activeEl.offsetLeft - (container.offsetWidth - activeEl.offsetWidth) / 2;
      container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <section className="w-full flex items-center justify-center bg-white shadow-md py-2">
      <div
        ref={scrollRef}
        className="flex flex-row items-center gap-3 px-3 overflow-x-auto scrollbar-none"
      >
        {subheaderLinks.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          const isLast = index === subheaderLinks.length - 1;

          return (
            <button
              key={item.route}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              onClick={() => router.push(item.route)}
              className={`flex flex-row items-center px-3 py-1.5 rounded-2xl border-0 cursor-pointer shrink-0 transition-opacity duration-100 ease-linear ${isLast ? "mr-0" : "mr-1.5"} ${isActive ? "bg-primary" : "bg-white"}`}
            >
              <div className="mr-1.25">
                <Icon
                  size={16}
                  className={isActive ? "text-on-primary" : "text-foreground-secondary"}
                  strokeWidth={2}
                />
              </div>
              <span
                className={`text-sm font-sans whitespace-nowrap ${isActive ? "font-semibold text-on-primary" : "font-normal text-foreground-secondary"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
