import { Category, Product } from "./types";

// Helper functions to fetch data from the API

// Primary API URL
const PRIMARY_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://openapi.programming-hero.com/api/bazardor";

// Fallback API URL
const FALLBACK_API_URL = "https://openapi.programming-hero.com/api/bazardor";

// Helper function to fetch data and retry with fallback if needed
async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  async function request(baseUrl: string): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status} for ${url}`);
    }

    const data = await response.json();
    return data as T;
  }

  try {
    // Try primary API first
    return await request(PRIMARY_API_URL);
  } catch (primaryError) {
    // If primary fails, try fallback API
    console.warn(
      `Primary API failed (${(primaryError as Error).message}), attempting alternative API...`
    );
    try {
      return await request(FALLBACK_API_URL);
    } catch (fallbackError) {
      console.error(
        `Both primary and fallback APIs failed for endpoint: ${endpoint}`,
        fallbackError
      );
      throw new Error(
        `Failed to fetch data from Bazar Dor API for endpoint: ${endpoint}`
      );
    }
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromApi<Category[]>("/categories");
  return Array.isArray(data) ? data : [];
}

// Get single category by slug
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const category = await fetchFromApi<Category>(
      `/categories/${encodeURIComponent(slug)}`
    );
    if (category && category.slug) return category;
  } catch {
    // Fallback: search in all categories
  }

  try {
    const all = await getCategories();
    return all.find((c) => c.slug === slug) || null;
  } catch {
    return null;
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const data = await fetchFromApi<Product[]>("/products");
  return Array.isArray(data) ? data : [];
}

// Get products filtered by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const data = await fetchFromApi<Product[]>(
      `/products?category=${encodeURIComponent(category)}`
    );
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // Fallback: filter from all products
  }

  try {
    const all = await getProducts();
    return all.filter((p) => p.category === category);
  } catch {
    return [];
  }
}

// Get single product by id
export async function getProduct(id: number | string): Promise<Product | null> {
  try {
    return await fetchFromApi<Product>(`/products/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

// Get single product by slug or id
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const allProducts = await getProducts();
    const matched = allProducts.find(
      (p) => p.slug === slug || String(p.id) === slug
    );
    return matched || null;
  } catch (error) {
    console.error(`Failed to get product by slug "${slug}":`, error);
    return null;
  }
}
