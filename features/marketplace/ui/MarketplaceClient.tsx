"use client";

import { DUMMY_PRODUCTS } from "@/data/products";
import { DepartmentsSection } from "./DepartmentsSection";
import { ProductGrid } from "./ProductGrid";
import { useState } from "react";

export function MarketplaceClient({ lang }: { lang: string }) {
  const [department, setDepartment] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = DUMMY_PRODUCTS.filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) : true,
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-4 pr-4 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
      </div>

      {/* Departments */}
      <DepartmentsSection
        active={department}
        onSelect={setDepartment}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      {/* Results count */}
      <p className="text-sm text-foreground-secondary">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
      </p>

      <ProductGrid products={filtered} lang={lang} />
    </div>
  );
}
