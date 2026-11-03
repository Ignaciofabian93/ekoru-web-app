import { describe, expect, it } from "vitest";
import { mapCatalogToAccordion as mapMarketplace } from "../../hooks/useDrawerMarketplace";
import { mapCatalogToAccordion as mapStores } from "../../hooks/useDrawerStores";

// The drawer and the navbar megamenu both link with these routes, and the
// catalog pages read their slugs from path segments — a query string
// (`/marketplace?dept=…`) silently lands on the section's landing page.

describe("marketplace catalog routes", () => {
  const [department] = mapMarketplace([
    {
      id: 1,
      name: "Tecnología",
      slug: "tecnologia",
      categories: [
        {
          id: 2,
          name: "Computación",
          slug: "computacion",
          productCategories: [{ id: 3, name: "Notebooks", slug: "notebooks" }],
        },
      ],
    },
  ]);

  it("nests each slug under its parent's, one path segment per level", () => {
    const category = department.children![0];
    const productCategory = category.children![0];

    expect(department.route).toBe("/marketplace/tecnologia");
    expect(category.route).toBe("/marketplace/tecnologia/computacion");
    expect(productCategory.route).toBe("/marketplace/tecnologia/computacion/notebooks");
  });
});

describe("stores catalog routes", () => {
  const [category] = mapStores([
    {
      id: 1,
      name: "Alimentos",
      slug: "alimentos",
      subCategoryItems: [{ id: 2, name: "A granel", slug: "a-granel" }],
    },
  ]);

  it("puts the category slug first and the subcategory under it", () => {
    expect(category.route).toBe("/stores/alimentos");
    expect(category.children![0].route).toBe("/stores/alimentos/a-granel");
  });
});
