// ============================================================================
// Data Types for Bazar Dor (বাজার দর)
// These interfaces represent the exact structure returned by the real API.
// ============================================================================

// Represents a product category (e.g., চাল, ডাল, সবজি)
export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

// Represents the daily price change direction and percentage
export interface PriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

// Represents price information in a specific local bazaar/market
export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

// Represents a complete product item with price statistics and market breakdown
export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string; // "kg" | "litre" | "dozen" | "piece"
  image: string; // Emoji character or illustration symbol
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: MarketPrice[];
}

// Sort options for the category and product listings
export type SortOption = "default" | "price-low-to-high" | "price-high-to-low";
