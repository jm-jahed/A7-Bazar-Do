// Data types for products and categories from the API

// Category type
export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

// Price change info
export interface PriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

// Market price info
export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

// Main product type
export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: MarketPrice[];
}

// Sort options for product listings
export type SortOption = "default" | "price-low-to-high" | "price-high-to-low";
