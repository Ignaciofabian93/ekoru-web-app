import type { Product } from "@/types/product";

// TODO(home): replace these placeholders with real data once the home
// endpoints land — featured products via `GET_EXCHANGEABLE_PRODUCTS_HOME`
// (graphql/home/queries.ts) and verified shops via `GET_STORES_CATALOG`
// (graphql/stores/queries.ts). Keep the prop shapes of ProductsHighlight /
// StoresHighlight so only the data source has to change.

export interface HighlightStore {
  id: string;
  name: string;
  rating: number;
  county: string;
  category: string;
  isVerified: boolean;
}

export const MOCK_STORES: HighlightStore[] = [
  {
    id: "verde-market",
    name: "Verde Market",
    rating: 4.9,
    county: "Providencia",
    category: "Organic",
    isVerified: true,
  },
  {
    id: "ecowear-boutique",
    name: "EcoWear Boutique",
    rating: 4.8,
    county: "Ñuñoa",
    category: "Zero Waste",
    isVerified: true,
  },
  {
    id: "green-roots",
    name: "Green Roots",
    rating: 4.7,
    county: "Las Condes",
    category: "Fair Trade",
    isVerified: false,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Recycled Wool Jacket",
    price: 44990,
    sellerId: "seller-1",
    condition: "LIKE_NEW",
    brand: "Patagonia",
    color: "Olive",
  },
  {
    id: 2,
    name: "Vintage City Bike",
    price: 129000,
    sellerId: "seller-2",
    condition: "FAIR",
    brand: "Oxford",
    color: "Teal",
  },
  {
    id: 3,
    name: "Handmade Ceramic Set",
    price: 17990,
    sellerId: "seller-3",
    condition: "NEW",
    brand: "Local Studio",
    color: "Sand",
  },
  {
    id: 4,
    name: "Refurbished Desk Lamp",
    price: 22990,
    sellerId: "seller-4",
    condition: "REFURBISHED",
    brand: "IKEA",
    color: "Black",
  },
];
