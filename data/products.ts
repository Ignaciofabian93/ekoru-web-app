import type { Product } from "@/types/product";

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Chaqueta de Lana Reciclada",
    description: "Chaqueta abrigada hecha con lana 100% reciclada. Perfecta para invierno con estilo sostenible.",
    price: 45990,
    brand: "EcoWear",
    color: "Verde",
    condition: "LIKE_NEW",
    rating: 4.8,
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 12.5,
      totalWaterSavingsLT: 340.8,
      materialBreakdown: [
        { materialType: "Lana reciclada", percentage: 70 },
        { materialType: "Algodón orgánico", percentage: 30 },
      ],
    },
    seller: {
      id: "seller-1",
      name: "Verde Market",
      sellerType: "COMPANY",
      isVerified: true,
      phone: "+56 9 1234 5678",
      address: "Av. Providencia 1234",
      county: "Providencia",
    },
  },
  {
    id: "2",
    name: "Bicicleta Urbana Vintage",
    description: "Bicicleta restaurada ideal para ciudad, cambios Shimano en perfecto estado.",
    price: 129990,
    brand: "Trek",
    color: "Azul",
    condition: "FAIR",
    rating: 4.6,
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 48.0,
      totalWaterSavingsLT: 120.0,
      materialBreakdown: [
        { materialType: "Acero reciclado", percentage: 85 },
        { materialType: "Caucho natural", percentage: 15 },
      ],
    },
    seller: {
      id: "seller-2",
      name: "Carlos Muñoz",
      sellerType: "PERSON",
      isVerified: true,
      phone: "+56 9 8765 4321",
      address: "Calle Bellavista 320",
      county: "Recoleta",
    },
  },
  {
    id: "3",
    name: "Maceta Cerámica Artesanal",
    description: "Set de 3 macetas hechas a mano con arcilla local. Ideal para plantas de interior.",
    price: 18500,
    brand: "TierraViva",
    color: "Terracota",
    condition: "NEW",
    rating: 4.9,
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 3.2,
      totalWaterSavingsLT: 55.0,
      materialBreakdown: [{ materialType: "Arcilla natural", percentage: 100 }],
    },
    seller: {
      id: "seller-3",
      name: "TierraViva",
      sellerType: "COMPANY",
      isVerified: true,
      phone: "+56 9 5555 1234",
      address: "Mercado Artesanal Local",
      county: "Ñuñoa",
    },
  },
  {
    id: "4",
    name: "Mochila de Cuero Vegano",
    description: "Mochila urbana de cuero vegano, compartimento para laptop de 15 pulgadas.",
    price: 79990,
    brand: "GreenBag",
    color: "Negro",
    condition: "NEW",
    rating: 4.7,
    images: [],
    seller: {
      id: "seller-4",
      name: "Ana Pérez",
      sellerType: "PERSON",
      isVerified: false,
      county: "Santiago Centro",
    },
  },
  {
    id: "5",
    name: "Lámpara de Bambu",
    description: "Lámpara de escritorio fabricada con bambu sostenible, luz cálida LED incluida.",
    price: 35000,
    brand: "NaturLight",
    color: "Natural",
    condition: "GOOD",
    rating: 4.5,
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 6.0,
      totalWaterSavingsLT: 80.0,
      materialBreakdown: [
        { materialType: "Bambu", percentage: 90 },
        { materialType: "Metal reciclado", percentage: 10 },
      ],
    },
    seller: {
      id: "seller-5",
      name: "NaturHome",
      sellerType: "STARTUP",
      isVerified: true,
      county: "Las Condes",
    },
  },
  {
    id: "6",
    name: "Tenis Deportivos Reciclados",
    description: "Zapatillas deportivas fabricadas con plástico oceánico reciclado, talla 42.",
    price: 89990,
    brand: "OceanStep",
    color: "Blanco/Azul",
    condition: "NEW",
    rating: 4.8,
    images: [],
    environmentalImpact: {
      totalCo2SavingsKG: 9.0,
      totalWaterSavingsLT: 200.0,
      materialBreakdown: [
        { materialType: "Plástico oceánico", percentage: 60 },
        { materialType: "Algodón orgánico", percentage: 40 },
      ],
    },
    seller: {
      id: "seller-6",
      name: "OceanStep Chile",
      sellerType: "COMPANY",
      isVerified: true,
      county: "Vitacura",
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return DUMMY_PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(price: number, currency = "CLP"): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function conditionLabel(condition: Product["condition"]): string {
  const MAP: Record<NonNullable<Product["condition"]>, string> = {
    NEW: "Nuevo",
    LIKE_NEW: "Como nuevo",
    GOOD: "Buen estado",
    FAIR: "Regular",
    POOR: "Desgastado",
  };
  return MAP[condition] ?? condition;
}
