import { Category, Product } from "./types";

// ============================================================================
// Bazar Dor API Service
// Handles fetching data from the real API with automatic fallback support.
// ============================================================================

// Primary API provided by the assignment
const PRIMARY_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

// Alternative fallback API provided by the assignment
const FALLBACK_API_URL = "https://api.abcz.workers.dev/api/bazardor";

/**
 * Generic fetcher that requests data from the primary API first.
 * If the primary API fails (e.g. 500 error or invalid response),
 * it seamlessly tries the alternative backup API.
 */
async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Helper to fetch and parse JSON safely
  async function request(baseUrl: string): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      // Revalidate cache every 60 seconds in Next.js
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status} for ${url}`);
    }

    const data = await response.json();
    return data as T;
  }

  try {
    // 1. Try Primary API first
    return await request(PRIMARY_API_URL);
  } catch (primaryError) {
    // 2. If Primary API fails, fallback to Alternative API
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

/**
 * Fetches the list of all categories.
 * Endpoint: /categories
 */
export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromApi<Category[]>("/categories");
  return Array.isArray(data) ? data : [];
}

/**
 * Fetches a single category by its slug identifier (e.g., "chal", "sobji").
 * Endpoint: /categories/[slug]
 */
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const category = await fetchFromApi<Category>(
      `/categories/${encodeURIComponent(slug)}`
    );
    if (category && category.slug) return category;
  } catch {
    // If single category endpoint fails, fallback to searching all categories
  }

  try {
    const all = await getCategories();
    return all.find((c) => c.slug === slug) || null;
  } catch {
    return null;
  }
}

/**
 * Fetches the list of all products.
 * Endpoint: /products
 */
export async function getProducts(): Promise<Product[]> {
  const data = await fetchFromApi<Product[]>("/products");
  return Array.isArray(data) ? data : [];
}

/**
 * Fetches products filtered by a category slug.
 * Endpoint: /products?category=[category]
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const data = await fetchFromApi<Product[]>(
      `/products?category=${encodeURIComponent(category)}`
    );
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // If filter endpoint fails, fallback to filtering from all products
  }

  try {
    const all = await getProducts();
    return all.filter((p) => p.category === category);
  } catch {
    return [];
  }
}

/**
 * Fetches a single product by its numeric ID.
 * Endpoint: /products/[id]
 */
export async function getProduct(id: number | string): Promise<Product | null> {
  try {
    return await fetchFromApi<Product>(`/products/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

/**
 * Fetches a single product by its string slug identifier (e.g., "sorno-machi-chal").
 * Finds the matching item from the real product catalog.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const allProducts = await getProducts();
    const matched = allProducts.find((p) => p.slug === slug);
    return matched || null;
  } catch (error) {
    console.error(`Failed to get product by slug "${slug}":`, error);
    return null;
  }
}
