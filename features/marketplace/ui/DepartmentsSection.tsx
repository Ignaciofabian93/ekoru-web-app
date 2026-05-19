"use client";

import { SlidersHorizontal } from "lucide-react";

const DEPARTMENTS = [
  { id: "all", label: "All" },
  { id: "clothing", label: "Clothing" },
  { id: "bikes", label: "Bikes" },
  { id: "home", label: "Home" },
  { id: "plants", label: "Plants" },
  { id: "electronics", label: "Electronics" },
  { id: "books", label: "Books" },
  { id: "sports", label: "Sports" },
];

interface Props {
  active: string;
  onSelect: (id: string) => void;
  onOpenFilters: () => void;
}

export function DepartmentsSection({ active, onSelect, onOpenFilters }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={onOpenFilters}
        className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <SlidersHorizontal size={14} strokeWidth={2} />
        Filters
      </button>
      {DEPARTMENTS.map((dep) => (
        <button
          key={dep.id}
          onClick={() => onSelect(dep.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === dep.id
              ? "bg-primary text-white"
              : "bg-surface border border-border text-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {dep.label}
        </button>
      ))}
    </div>
  );
}
